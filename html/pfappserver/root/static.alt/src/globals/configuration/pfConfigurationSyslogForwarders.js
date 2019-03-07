import i18n from '@/utils/locale'
import pfFormChosen from '@/components/pfFormChosen'
import pfFormInput from '@/components/pfFormInput'
import pfFormRangeToggle from '@/components/pfFormRangeToggle'
import {
  pfConfigurationListColumns,
  pfConfigurationListFields,
  pfConfigurationAttributesFromMeta,
  pfConfigurationValidatorsFromMeta
} from '@/globals/configuration/pfConfiguration'
import {
  and,
  or,
  not,
  conditional,
  isFQDN,
  isPort,
  hasSyslogForwarders,
  syslogForwarderExists
} from '@/globals/pfValidators'

const {
  ipAddress,
  maxLength,
  number,
  required
} = require('vuelidate/lib/validators')

export const pfConfigurationSyslogForwardersListColumns = [
  { ...pfConfigurationListColumns.id, ...{ label: i18n.t('Syslog Name') } }, // re-label
  { ...pfConfigurationListColumns.type, ...{ label: i18n.t('Type') } }, // re-label
  pfConfigurationListColumns.buttons
]

export const pfConfigurationSyslogForwardersListFields = [
  { ...pfConfigurationListFields.id, ...{ text: i18n.t('Syslog Name') } }, // re-text
  pfConfigurationListFields.type
]

export const pfConfigurationSyslogForwardersListConfig = (context = {}) => {
  return {
    columns: pfConfigurationSyslogForwardersListColumns,
    fields: pfConfigurationSyslogForwardersListFields,
    rowClickRoute (item, index) {
      return { name: 'syslogForwarder', params: { id: item.id } }
    },
    searchPlaceholder: i18n.t('Search by Syslog name or type'),
    searchableOptions: {
      searchApiEndpoint: 'config/syslog_forwarders',
      defaultSortKeys: ['id'],
      defaultSearchCondition: {
        op: 'and',
        values: [{
          op: 'or',
          values: [
            { field: 'id', op: 'contains', value: null },
            { field: 'type', op: 'contains', value: null },
            { field: 'proto', op: 'contains', value: null },
            { field: 'host', op: 'contains', value: null },
            { field: 'port', op: 'contains', value: null }
          ]
        }]
      },
      defaultRoute: { name: 'syslogForwarders' }
    },
    searchableQuickCondition: (quickCondition) => {
      return {
        op: 'and',
        values: [{
          op: 'or',
          values: [
            { field: 'id', op: 'contains', value: quickCondition },
            { field: 'type', op: 'contains', value: quickCondition },
            { field: 'proto', op: 'contains', value: quickCondition },
            { field: 'host', op: 'contains', value: quickCondition },
            { field: 'port', op: 'contains', value: quickCondition }
          ]
        }]
      }
    }
  }
}

export const pfConfigurationSyslogForwarderViewFields = (context) => {
  const {
    isNew = false,
    isClone = false,
    form = {},
    options: {
      meta = {}
    }
  } = context
  return [
    {
      tab: null, // ignore tabs
      fields: [
        {
          label: i18n.t('Syslog Name'),
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
                ...pfConfigurationValidatorsFromMeta(meta, 'id'),
                ...{
                  [i18n.t('Syslog Forwarder exists.')]: not(and(required, conditional(isNew || isClone), hasSyslogForwarders, syslogForwarderExists))
                }
              }
            }
          ]
        },
        {
          if: ['server'].includes(form.type),
          label: i18n.t('Protocol'),
          fields: [
            {
              key: 'proto',
              component: pfFormChosen,
              attrs: pfConfigurationAttributesFromMeta(meta, 'proto'),
              validators: pfConfigurationValidatorsFromMeta(meta, 'proto')
            }
          ]
        },
        {
          if: ['server'].includes(form.type),
          label: i18n.t('Host'),
          fields: [
            {
              key: 'host',
              component: pfFormInput,
              attrs: pfConfigurationAttributesFromMeta(meta, 'host'),
              validators: pfConfigurationValidatorsFromMeta(meta, 'host')
            }
          ]
        },
        {
          if: ['server'].includes(form.type),
          label: i18n.t('Port'),
          fields: [
            {
              key: 'port',
              component: pfFormInput,
              attrs: pfConfigurationAttributesFromMeta(meta, 'port'),
              validators: pfConfigurationValidatorsFromMeta(meta, 'port')
            }
          ]
        },
        {
          label: i18n.t('All logs'),
          fields: [
            {
              key: 'all_logs',
              component: pfFormRangeToggle,
              attrs: {
                values: { checked: 'enabled', unchecked: 'disabled' }
              }
            }
          ]
        },
        {
          if: form.all_logs === 'disabled',
          label: i18n.t('Logs'),
          fields: [
            {
              key: 'logs',
              component: pfFormChosen,
              attrs: pfConfigurationAttributesFromMeta(meta, 'logs'),
              validators: pfConfigurationValidatorsFromMeta(meta, 'logs')
            }
          ]
        }
      ]
    }
  ]
}
