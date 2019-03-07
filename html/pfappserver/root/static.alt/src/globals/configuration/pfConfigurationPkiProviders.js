import i18n from '@/utils/locale'
import pfFieldTypeValue from '@/components/pfFieldTypeValue'
import pfFieldAttributeOperatorValue from '@/components/pfFieldAttributeOperatorValue'
import pfFieldRule from '@/components/pfFieldRule'
import pfFormChosen from '@/components/pfFormChosen'
import pfFormFields from '@/components/pfFormFields'
import pfFormInput from '@/components/pfFormInput'
import pfFormPassword from '@/components/pfFormPassword'
import pfFormRangeToggle from '@/components/pfFormRangeToggle'
import pfFormTextarea from '@/components/pfFormTextarea'
import {
  pfConfigurationActions,
  pfConfigurationConditions,
  pfConfigurationListColumns,
  pfConfigurationListFields,
  pfConfigurationAttributesFromMeta,
  pfConfigurationValidatorsFromMeta
} from '@/globals/configuration/pfConfiguration'
import {
  alphaNum,
  and,
  not,
  conditional,
  hasPkiProviders,
  pkiProviderExists,
  limitSiblingFields
} from '@/globals/pfValidators'

const {
  maxLength,
  required
} = require('vuelidate/lib/validators')

export const pfConfigurationPkiProvidersListColumns = [
  { ...pfConfigurationListColumns.id, ...{ label: i18n.t('Name') } }, // re-label
  pfConfigurationListColumns.description,
  pfConfigurationListColumns.type,
  pfConfigurationListColumns.buttons
]

export const pfConfigurationPkiProvidersListFields = [
  { ...pfConfigurationListFields.id, ...{ text: i18n.t('Name') } }, // re-text
  pfConfigurationListFields.description,
  pfConfigurationListFields.type
]

export const pfConfigurationPkiProviderListConfig = (context = {}) => {
  return {
    columns: pfConfigurationPkiProvidersListColumns,
    fields: pfConfigurationPkiProvidersListFields,
    rowClickRoute (item, index) {
      return { name: 'pki_provider', params: { id: item.id } }
    },
    searchPlaceholder: i18n.t('Search by name or description'),
    searchableOptions: {
      searchApiEndpoint: 'config/pki_providers',
      defaultSortKeys: ['id'],
      defaultSearchCondition: {
        op: 'and',
        values: [{
          op: 'or',
          values: [
            { field: 'id', op: 'contains', value: null },
            { field: 'description', op: 'contains', value: null },
            { field: 'type', op: 'contains', value: null }
          ]
        }]
      },
      defaultRoute: { name: 'pkiProviders' }
    },
    searchableQuickCondition: (quickCondition) => {
      return {
        op: 'and',
        values: [{
          op: 'or',
          values: [
            { field: 'id', op: 'contains', value: quickCondition },
            { field: 'description', op: 'contains', value: quickCondition },
            { field: 'type', op: 'contains', value: quickCondition }
          ]
        }]
      }
    }
  }
}

export const pfConfigurationPkiProviderViewFields = (context = {}) => {
  const {
    isNew = false,
    isClone = false,
    providerType = null,
    options: {
      meta = {}
    }
  } = context
  return [
    {
      tab: null,
      fields: [
        {
          label: i18n.t('PKI Provider Name'),
          fields: [
            {
              key: 'id',
              component: pfFormInput,
              attrs: {
                ...pfConfigurationAttributesFromMeta(meta, 'id'),
                ...{
                  disabled: (!isNew && !isClone)
                }
              },
              validators: {
                ...pfConfigurationValidatorsFromMeta(meta, 'id', 'Name'),
                ...{
                  [i18n.t('PKI Provider exists.')]: not(and(required, conditional(isNew || isClone), hasPkiProviders, pkiProviderExists))
                }
              }
            }
          ]
        },
        {
          if: ['scep'].includes(providerType),
          label: i18n.t('Url'),
          text: i18n.t('The url used to connect to the SCEP PKI service.'),
          fields: [
            {
              key: 'url',
              component: pfFormInput,
              attrs: pfConfigurationAttributesFromMeta(meta, 'url'),
              validators: pfConfigurationValidatorsFromMeta(meta, 'url', 'Url')
            }
          ]
        },
        {
          if: ['packetfence_pki'].includes(providerType),
          label: i18n.t('Protocol'),
          text: i18n.t('Protocol to use to contact the PacketFence PKI API.'),
          fields: [
            {
              key: 'proto',
              component: pfFormChosen,
              attrs: pfConfigurationAttributesFromMeta(meta, 'proto'),
              validators: pfConfigurationValidatorsFromMeta(meta, 'proto', 'Protocol')
            }
          ]
        },
        {
          if: ['packetfence_pki'].includes(providerType),
          label: i18n.t('Host'),
          text: i18n.t('Host which hosts the PacketFence PKI.'),
          fields: [
            {
              key: 'host',
              component: pfFormInput,
              attrs: pfConfigurationAttributesFromMeta(meta, 'host'),
              validators: pfConfigurationValidatorsFromMeta(meta, 'host', 'Host')
            }
          ]
        },
        {
          if: ['packetfence_pki'].includes(providerType),
          label: i18n.t('Port'),
          text: i18n.t('Port on which to contact the PacketFence PKI API.'),
          fields: [
            {
              key: 'port',
              component: pfFormInput,
              attrs: pfConfigurationAttributesFromMeta(meta, 'port'),
              validators: pfConfigurationValidatorsFromMeta(meta, 'port', 'Port')
            }
          ]
        },
        {
          if: ['packetfence_pki'].includes(providerType),
          label: i18n.t('Username'),
          text: i18n.t('Username to connect to the PKI.'),
          fields: [
            {
              key: 'username',
              component: pfFormInput,
              attrs: pfConfigurationAttributesFromMeta(meta, 'username'),
              validators: pfConfigurationValidatorsFromMeta(meta, 'username', 'Username')
            }
          ]
        },
        {
          if: ['scep'].includes(providerType),
          label: i18n.t('Username'),
          text: i18n.t('Username to connect to the SCEP PKI Service.'),
          fields: [
            {
              key: 'username',
              component: pfFormInput,
              attrs: pfConfigurationAttributesFromMeta(meta, 'username'),
              validators: pfConfigurationValidatorsFromMeta(meta, 'username', 'Username')
            }
          ]
        },
        {
          if: ['packetfence_pki', 'scep'].includes(providerType),
          label: i18n.t('Password'),
          text: i18n.t('Password for the username filled in above.'),
          fields: [
            {
              key: 'password',
              component: pfFormPassword,
              attrs: pfConfigurationAttributesFromMeta(meta, 'password'),
              validators: pfConfigurationValidatorsFromMeta(meta, 'password', 'Password')
            }
          ]
        },
        {
          if: ['packetfence_pki'].includes(providerType),
          label: i18n.t('Profile'),
          text: i18n.t('Profile used for the generation of certificate.'),
          fields: [
            {
              key: 'profile',
              component: pfFormInput,
              attrs: pfConfigurationAttributesFromMeta(meta, 'profile'),
              validators: pfConfigurationValidatorsFromMeta(meta, 'profile', 'Profile')
            }
          ]
        },
        {
          if: ['packetfence_pki', 'scep'].includes(providerType),
          label: i18n.t('Country'),
          text: i18n.t('Country for the certificate.'),
          fields: [
            {
              key: 'country',
              component: pfFormChosen,
              attrs: pfConfigurationAttributesFromMeta(meta, 'country'),
              validators: pfConfigurationValidatorsFromMeta(meta, 'country', 'Country')
            }
          ]
        },
        {
          if: ['packetfence_pki', 'scep'].includes(providerType),
          label: i18n.t('State'),
          text: i18n.t('State for the certificate.'),
          fields: [
            {
              key: 'state',
              component: pfFormInput,
              attrs: pfConfigurationAttributesFromMeta(meta, 'state'),
              validators: pfConfigurationValidatorsFromMeta(meta, 'state', 'State')
            }
          ]
        },
        {
          if: ['scep'].includes(providerType),
          label: i18n.t('Locality'),
          text: i18n.t('Locality for the certificate.'),
          fields: [
            {
              key: 'locality',
              component: pfFormChosen,
              attrs: pfConfigurationAttributesFromMeta(meta, 'locality'),
              validators: pfConfigurationValidatorsFromMeta(meta, 'locality', 'Locality')
            }
          ]
        },
        {
          if: ['packetfence_pki', 'scep'].includes(providerType),
          label: i18n.t('Organization'),
          text: i18n.t('Organization for the certificate.'),
          fields: [
            {
              key: 'organization',
              component: pfFormInput,
              attrs: pfConfigurationAttributesFromMeta(meta, 'organization'),
              validators: pfConfigurationValidatorsFromMeta(meta, 'organization', 'Organization')
            }
          ]
        },
        {
          if: ['scep'].includes(providerType),
          label: i18n.t('Organizational unit'),
          text: i18n.t('Organizational unit for the certificate.'),
          fields: [
            {
              key: 'organizational_unit',
              component: pfFormInput,
              attrs: pfConfigurationAttributesFromMeta(meta, 'organizational_unit'),
              validators: pfConfigurationValidatorsFromMeta(meta, 'organizational_unit', 'Unit')
            }
          ]
        },
        {
          if: ['packetfence_pki', 'scep'].includes(providerType),
          label: i18n.t('Common Name Attribute'),
          text: i18n.t('Defines what attribute of the node to use as the common name during the certificate generation.'),
          fields: [
            {
              key: 'cn_attribute',
              component: pfFormChosen,
              attrs: pfConfigurationAttributesFromMeta(meta, 'cn_attribute'),
              validators: pfConfigurationValidatorsFromMeta(meta, 'cn_attribute', 'Attribute')
            }
          ]
        },
        {
          if: ['packetfence_pki', 'scep'].includes(providerType),
          label: i18n.t('Common Name Format'),
          text: i18n.t('Defines how the common name will be formated. %s will expand to the defined Common Name Attribute value.'),
          fields: [
            {
              key: 'cn_format',
              component: pfFormInput,
              attrs: pfConfigurationAttributesFromMeta(meta, 'cn_format'),
              validators: pfConfigurationValidatorsFromMeta(meta, 'cn_format', 'Format')
            }
          ]
        },
        {
          if: ['packetfence_pki'].includes(providerType),
          label: i18n.t('Revoke on unregistration'),
          text: i18n.t('Check this box to have the certificate revoke when the node using it is unregistered. Do not use if multiple devices share the same certificate.'),
          fields: [
            {
              key: 'revoke_on_unregistration',
              component: pfFormRangeToggle,
              attrs: {
                values: { checked: 'Y', unchecked: 'N' }
              }
            }
          ]
        },
        {
          if: ['packetfence_local'].includes(providerType),
          label: i18n.t('Client cert path'),
          text: i18n.t('Path of the client cert that will be used to generate the p12.'),
          fields: [
            {
              key: 'client_cert_path',
              component: pfFormInput,
              attrs: pfConfigurationAttributesFromMeta(meta, 'client_cert_path'),
              validators: pfConfigurationValidatorsFromMeta(meta, 'client_cert_path', 'Path')
            }
          ]
        },
        {
          if: ['packetfence_local'].includes(providerType),
          label: i18n.t('Client key path'),
          text: i18n.t('Path of the client key that will be used to generate the p12.'),
          fields: [
            {
              key: 'client_key_path',
              component: pfFormInput,
              attrs: pfConfigurationAttributesFromMeta(meta, 'client_key_path'),
              validators: pfConfigurationValidatorsFromMeta(meta, 'client_key_path', 'Path')
            }
          ]
        },
        {
          if: ['packetfence_local', 'packetfence_pki', 'scep'].includes(providerType),
          label: i18n.t('CA cert path'),
          text: i18n.t('Path of the CA certificate used to generate client certificate/key combination.'),
          fields: [
            {
              key: 'ca_cert_path',
              component: pfFormInput,
              attrs: pfConfigurationAttributesFromMeta(meta, 'ca_cert_path'),
              validators: pfConfigurationValidatorsFromMeta(meta, 'ca_cert_path', 'Path')
            }
          ]
        },
        {
          if: ['packetfence_local', 'packetfence_pki', 'scep'].includes(providerType),
          label: i18n.t('Server cert path'),
          text: i18n.t('Path of the RADIUS server authentication certificate.'),
          fields: [
            {
              key: 'server_cert_path',
              component: pfFormInput,
              attrs: pfConfigurationAttributesFromMeta(meta, 'server_cert_path'),
              validators: pfConfigurationValidatorsFromMeta(meta, 'server_cert_path', 'Path')
            }
          ]
        }
      ]
    }
  ]
}
