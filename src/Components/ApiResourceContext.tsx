import { createContext, PropsWithChildren, useContext } from 'react'
import {
    FAMILY_LOOKUP_KEYS,
    FIELDS,
    GalvResource,
    get_has_family,
    LookupKey,
} from '../constants'
import { AxiosError, AxiosResponse } from 'axios'
import { UseQueryResult } from '@tanstack/react-query'
import { has, id_from_ref_props } from './misc'
import {
    SerializerDescriptionSerializer,
    useFetchResource,
} from './FetchResourceContext'

export interface IApiResourceContext<T extends GalvResource = GalvResource> {
    apiResource?: T
    apiResourceDescription?: SerializerDescriptionSerializer
    apiQuery?: UseQueryResult<AxiosResponse<T>, AxiosError>
    family?: GalvResource
    familyDescription?: SerializerDescriptionSerializer
    familyQuery?: UseQueryResult<AxiosResponse<GalvResource>, AxiosError>
}

const ApiResourceContext = createContext({} as IApiResourceContext)

export const useApiResource = <T extends GalvResource = GalvResource>() => {
    const context = useContext(ApiResourceContext) as IApiResourceContext<T>
    if (context === undefined) {
        throw new Error(
            'useApiResource must be used within an ApiResourceContextProvider',
        )
    }
    return context
}

type ApiResourceContextProviderProps = {
    lookup_key: LookupKey
    resource_id: string | number
}

export const get_select_function =
    <T,>(lookup_key: LookupKey) =>
    (data: AxiosResponse<GalvResource>) => {
        Object.entries(FIELDS[lookup_key]).forEach(([k, v]) => {
            if (v.transformation !== undefined)
                data.data[k as keyof typeof data.data] = v.transformation(
                    data.data[k as keyof typeof data.data],
                )
        })
        return data as AxiosResponse<T>
    }

function ApiResourceContextStandaloneProvider<T extends GalvResource>({
    lookup_key,
    resource_id,
    children,
}: PropsWithChildren<ApiResourceContextProviderProps>) {
    const { useRetrieveQuery, useDescribeQuery } = useFetchResource()
    const query = useRetrieveQuery<T>(lookup_key, resource_id, {
        extra_query_options: { select: get_select_function(lookup_key) },
    })
    const description_query = useDescribeQuery(lookup_key)

    return (
        <ApiResourceContext.Provider
            value={{
                apiResource: query.data?.data,
                apiResourceDescription: description_query.data?.data,
                apiQuery: query,
            }}
        >
            {children}
        </ApiResourceContext.Provider>
    )
}

function ApiResourceContextWithFamilyProvider<T extends GalvResource>({
    lookup_key,
    resource_id,
    children,
}: PropsWithChildren<ApiResourceContextProviderProps>) {
    if (!get_has_family(lookup_key))
        throw new Error(
            `Cannot use ApiResourceContextWithFamilyProvider for ${lookup_key} because it does not have a family.`,
        )

    const { useRetrieveQuery, useDescribeQuery } = useFetchResource()
    const query = useRetrieveQuery<T>(lookup_key, resource_id, {
        extra_query_options: { select: get_select_function(lookup_key) },
    })

    const family_lookup_key = FAMILY_LOOKUP_KEYS[lookup_key]
    const family_query = useRetrieveQuery(
        family_lookup_key,
        has(query.data?.data, 'family')
            ? id_from_ref_props(query.data.data.family)
            : 'never',
        {
            extra_query_options: {
                enabled: has(query.data?.data, 'family'),
                select: get_select_function<T>(family_lookup_key),
            },
        },
    )

    const description_query = useDescribeQuery(lookup_key)
    const family_description_query = useDescribeQuery(family_lookup_key)

    return (
        <ApiResourceContext.Provider
            value={{
                apiResource: query.data?.data,
                apiResourceDescription: description_query.data?.data,
                apiQuery: query,
                family: family_query.data?.data,
                familyDescription: family_description_query.data?.data,
                familyQuery: family_query,
            }}
        >
            {children}
        </ApiResourceContext.Provider>
    )
}

/**
 * Expose a context with the resource and its family (if it has one).
 * This allows us to query the family while honoring the rule that we can't
 * call hooks conditionally.
 *
 * Family will be undefined if the resource does not have a family, or if the
 * family query has not yet resolved.
 */
export default function ApiResourceContextProvider(
    props: PropsWithChildren<ApiResourceContextProviderProps>,
) {
    return get_has_family(props.lookup_key) ? (
        <ApiResourceContextWithFamilyProvider {...props} />
    ) : (
        <ApiResourceContextStandaloneProvider {...props} />
    )
}
