import { parseString } from 'xml2js'


interface Edmx {
    Version: string
    DataServices: Schema[]
}

interface Schema {
    Namespace: string
    EntityTypes?: EntityType[]
    EntitySets?: EntitySet[]
}

export interface EntityType {
    Name: string
    Key: string[]
    Property: Property[]
}

interface Property {
    Name: string
    Type: 'Edm.Int32' | 'Edm.String' | 'Edm.DateTimeOffset'
}

interface EntitySet {
    Name: string
    EntityType: string
}

interface Attrs<T> {
    $: T
}

namespace edmx {
    export interface Root {
        'edmx:Edmx': Edmx
    }
    interface Edmx extends Attrs<{ Version: string }> {
        'edmx:DataServices': {
            Schema: Schema[]
        }[]
    }
    interface Schema extends Attrs<{ Namespace: string }> {
        EntityType?: EntityType[]
        EntityContainer?: EntityContainer[]
    }
    interface EntityType extends Attrs<{ Name: string }> {
        Key: {
            PropertyRef: Attrs<{ Name: string }>[]
        }[]
        Property: Attrs<{ Name: string, Type: string }>[]
        NavigationProperty: Attrs<{ Name: string, Type: string }>[]
    }
    interface EntityContainer extends Attrs<{ Name: string }> {
        EntitySet: EntitySet[]
    }
    interface EntitySet extends Attrs<{ Name: string, EntityType: string }> {
        NavigationPropertyBinding: Attrs<{ Path: string, Target: string }>[]
    }
}


export function parse(xml: string) {
    return new Promise<Edmx>((res, rej) => {
        parseString(xml, (err, result: edmx.Root) => {
            // console.log(JSON.stringify(result))
            if (err) rej(err)
            const obj = {} as Edmx
            obj.Version = result["edmx:Edmx"].$.Version
            obj.DataServices = result["edmx:Edmx"]["edmx:DataServices"][0].Schema.map((schema) => {
                const sma = {} as Schema
                sma.Namespace = schema.$.Namespace
                sma.EntityTypes = schema.EntityType ? schema.EntityType.map((en) => {
                    const xentry = {} as EntityType
                    xentry.Name = en.$.Name
                    xentry.Key = en.Key ? en.Key.map((k: any) => {
                        return k.PropertyRef.map((e: any) => e.$.Name)
                    }) : []
                    xentry.Property = en.Property ? en.Property.map((o) => {
                        const e = {} as Property
                        e.Name = o.$.Name
                        e.Type = o.$.Type as any
                        return e
                    }) : []
                    return xentry
                }) : undefined
                sma.EntitySets = schema.EntityContainer && schema.EntityContainer.length ? schema.EntityContainer[0].EntitySet.map(e => {
                    const o = {} as EntitySet
                    o.Name = e.$.Name
                    o.EntityType = e.$.EntityType
                    return o
                }) : undefined
                return sma
            })
            res(obj)
        })
    })
}
