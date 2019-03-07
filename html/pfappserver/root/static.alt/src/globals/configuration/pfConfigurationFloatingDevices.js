import i18n from '@/utils/locale'
import pfFormInput from '@/components/pfFormInput'
import pfFormToggle from '@/components/pfFormToggle'
import { pfRegExp as regExp } from '@/globals/pfRegExp'
import {
  pfConfigurationListColumns,
  pfConfigurationListFields,
  pfConfigurationAttributesFromMeta,
  pfConfigurationValidatorsFromMeta
} from '@/globals/configuration/pfConfiguration'
import {
  and,
  not,
  conditional,
  hasFloatingDevices,
  floatingDeviceExists
} from '@/globals/pfValidators'

const {
  required,
  integer,
  ipAddress,
  macAddress,
  maxLength
} = require('vuelidate/lib/validators')

export const pfConfigurationFloatingDevicesListColumns = [
  { ...pfConfigurationListColumns.id, ...{ label: i18n.t('MAC') } }, // re-label
  pfConfigurationListColumns.ip,
  pfConfigurationListColumns.pvid,
  pfConfigurationListColumns.taggedVlan,
  pfConfigurationListColumns.trunkPort,
  pfConfigurationListColumns.buttons
]

export const pfConfigurationFloatingDevicesListFields = [
  { ...pfConfigurationListFields.id, ...{ text: i18n.t('MAC') } }, // re-text
  pfConfigurationListFields.ip
]

export const pfConfigurationFloatingDeviceListConfig = (context = {}) => {
  const { $i18n } = context
  return {
    columns: pfConfigurationFloatingDevicesListColumns,
    fields: pfConfigurationFloatingDevicesListFields,
    rowClickRoute (item, index) {
      return { name: 'floating_device', params: { id: item.id } }
    },
    searchPlaceholder: $i18n.t('Search by MAC or IP address'),
    searchableOptions: {
      searchApiEndpoint: 'config/floating_devices',
      defaultSortKeys: ['id'],
      defaultSearchCondition: {
        op: 'and',
        values: [{
          op: 'or',
          values: [
            { field: 'id', op: 'contains', value: null },
            { field: 'ip', op: 'contains', value: null }
          ]
        }]
      },
      defaultRoute: { name: 'floating_devices' }
    },
    searchableQuickCondition: (quickCondition) => {
      return {
        op: 'and',
        values: [
          {
            op: 'or',
            values: [
              { field: 'id', op: 'contains', value: quickCondition },
              { field: 'ip', op: 'contains', value: quickCondition }
            ]
          }
        ]
      }
    }
  }
}

export const pfConfigurationFloatingDeviceViewFields = (context = {}) => {
  const {
    isNew = false,
    isClone = false,
    options: {
      meta = {}
    }
  } = context
  return [
    {
      tab: null, // ignore tabs
      fields: [
        {
          label: i18n.t('MAC Address'),
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
                ...pfConfigurationValidatorsFromMeta(meta, 'id', 'MAC'),
                ...{
                  [i18n.t('Floating Device exists.')]: not(and(required, conditional(isNew || isClone), hasFloatingDevices, floatingDeviceExists))
                }
              }
            }
          ]
        },
        {
          label: i18n.t('IP Address'),
          fields: [
            {
              key: 'ip',
              component: pfFormInput,
              attrs: pfConfigurationAttributesFromMeta(meta, 'ip'),
              validators: pfConfigurationValidatorsFromMeta(meta, 'ip')
            }
          ]
        },
        {
          label: i18n.t('Native VLAN'),
          text: i18n.t('VLAN in which PacketFence should put the port.'),
          fields: [
            {
              key: 'pvid',
              component: pfFormInput,
              attrs: pfConfigurationAttributesFromMeta(meta, 'pvid'),
              validators: pfConfigurationValidatorsFromMeta(meta, 'pvid')
            }
          ]
        },
        {
          label: i18n.t('Trunk Port'),
          text: i18n.t('The port must be configured as a muti-vlan port.'),
          fields: [
            {
              key: 'trunkPort',
              component: pfFormToggle,
              attrs: {
                values: { checked: 'yes', unchecked: 'no' }
              }
            }
          ]
        },
        {
          label: i18n.t('Tagged VLANs'),
          text: i18n.t('Comma separated list of VLANs. If the port is a multi-vlan, these are the VLANs that have to be tagged on the port.'),
          fields: [
            {
              key: 'taggedVlan',
              component: pfFormInput,
              attrs: pfConfigurationAttributesFromMeta(meta, 'taggedVlan'),
              validators: pfConfigurationValidatorsFromMeta(meta, 'taggedVlan')
            }
          ]
        }
      ]
    }
  ]
}
