import { Link, Config } from './types'
import { addAssetsToAlbum, getAssetInfo, searchAssets } from '@immich/sdk'
import store from './store'
import path from 'path'

export class PersonToAlbum {
  config: Config

  constructor () {
    this.initConfig()
  }

  /**
   * Read the config.json file or parse the CONFIG env value to get the configuration
   */
  initConfig () {
    try {
      if (process.env.CONFIG) {
        // Attempt to parse docker-compose config string into JSON (if specified)
        this.config = JSON.parse(process.env.CONFIG)
      } else {
        const configJson = require(path.resolve('../data/config.json'))
        if (typeof configJson === 'object') this.config = configJson
      }
    } catch (e) {
      console.log(e)
      console.log('Unable to parse config file.')
    }
  }

  async processPerson (link: Link) {
    let nextPage: string | null = '1'
    let mostRecent: string | undefined

    // Resolve effective person IDs (support both legacy personId and new personIds)
    const personIds = link.personIds ?? (link.personId ? [link.personId] : [])
    const personIdSet = new Set(personIds)
    const minCount = link.minCount ?? 1

    if (link.description) console.log(`=== ${link.description} ===`)
    console.log(`Adding person(s) ${personIds.join(', ')} to album ${link.albumId}`)

    while (nextPage !== null) {
      console.log(` - Processing page ${nextPage}`)
      const res = await searchAssets({
        metadataSearchDto: {
          // I'm using `updated` here because this is documented to be the time when
          // the asset was updated in Immich, and nothing to do with the EXIF data.
          // https://immich.app/docs/api/get-asset-info
          // This may also be the case for `created`, but it doesn't specify that in the docs.
          updatedAfter: store.get(this.getUpdateKeyName(link)),
          page: parseInt(nextPage, 10), // why is `nextPage` a string and `page` a number? ¯\_(ツ)_/¯
          personIds
        }
      })

      // Track the most recent photo timestamp so we can update the store
      if (!mostRecent && res.assets.items[0]) mostRecent = res.assets.items[0].updatedAt

      let assetIds: string[]
      if (minCount <= 1) {
        // No additional filtering needed; all found assets already contain at least one matching person
        assetIds = res.assets.items.map(x => x.id)
      } else {
        // Filter assets: only include those with at least minCount matching people from the list
        assetIds = []
        for (const asset of res.assets.items) {
          // Use people from the search result if already populated, otherwise fetch asset details
          const people = asset.people ?? (await getAssetInfo({ id: asset.id })).people ?? []
          const matchCount = people.filter(p => personIdSet.has(p.id)).length
          if (matchCount >= minCount) {
            assetIds.push(asset.id)
          }
        }
      }

      if (assetIds.length > 0) {
        await addAssetsToAlbum({
          id: link.albumId,
          bulkIdsDto: {
            ids: assetIds
          }
        })
      }
      nextPage = res.assets.nextPage
    }

    // Store the most recent asset update value so we can start processing only newer items next time.
    await store.set(this.getUpdateKeyName(link), mostRecent)
    console.log()
  }

  /**
   * Get the correctly formatted key name for most-recent updated value in the store
   */
  getUpdateKeyName (link: Link) {
    const personIds = link.personIds ?? (link.personId ? [link.personId] : [])
    return [link.apiKeyShort, [...personIds].sort().join('+'), link.albumId].join(':')
  }
}
