import React, { Component } from 'react'

import {
  MLAvatar,
  MLButton,
  MLConfigProvider,
  MLDatePicker,
  MLEditableSlider,
  MLEmpty,
  MLHeader,
  MLLayout,
  MLPagination,
  MLResult,
  MLSlider,
  MLTooltip,
  mlmessage,
} from '@marklogic/design-system'

import {
  RouteSolid,
  CheckCircleFilled,
  SearchOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  UserOutlined,
  SmileOutlined,
  ClockCircleOutlined,
  SmileBeamSolid,
} from '@marklogic/design-system/es/MLIcon'

const configValues = {
  dateFormat: 'YYYY-MMM-DD', // Default for all dates, and DatePicker
  dateTimeFormat: 'YYYY-MMM-DD, HH:mm:ss', // default for all dates with times, and DatePicker with times
  monthFormat: 'YYYY-MM', // default for Month picker
  weekFormat: 'YYYY-wo', // default for Week picker
  yearFormat: 'YYYY', // default for Year picker
}

function makeIcon(icon, title) {
  return (
    <MLTooltip
      title={title}
      placement='bottom'
      key={title}
    >
      <a href={`#${title}`}>
        {icon}
      </a>
    </MLTooltip>
  )
}

mlmessage.config({
  maxCount: 3,
})
const info = () => {
  mlmessage.info('This is an info message')
}
const success = () => {
  mlmessage.success('This is a success message')
}

const error = () => {
  mlmessage.error('This is an error message')
}

const warning = () => {
  mlmessage.warning('This is a warning message')
}

const loading = () => {
  const hide = mlmessage.loading('Action in progress..', 0)
  // Dismiss manually and asynchronously
  setTimeout(hide, 2500)
}

const customIcon = () => {
  mlmessage.info({ content: 'smiley content', icon: <SmileOutlined /> })
}

export default class App extends Component {
  render() {
    return (
      <div>
        <MLConfigProvider {...configValues}>
          <MLLayout>
            <MLLayout.MLHeader style={{ padding: 0, position: 'fixed', zIndex: 1, width: '100%' }}>
              <MLHeader
                title='Data Hub Central'
                avatar={
                  <a href='#'>
                    <MLAvatar
                      src='https://www.marklogic.com/wp-content/themes/marklogic-bs4/resources/favicons/favicon-32x32.png'
                      style={{ backgroundColor: 'white' }} // Because the given src has transparent background
                      size={48}
                    />
                  </a>
                }
                extra={[
                  makeIcon(<RouteSolid />, 'route'),
                  <span key='divider' style={{ borderLeft: '1px dashed' }} />,
                  makeIcon(<SearchOutlined />, 'search'),
                  makeIcon(<QuestionCircleOutlined />, 'help'),
                  makeIcon(<SettingOutlined />, 'settings'),
                  makeIcon(<UserOutlined />, 'user'),
                ]}
              />
            </MLLayout.MLHeader>
            <MLLayout.MLContent style={{ marginTop: 64 }}>
              <MLButton type='primary'>Test</MLButton>
              <MLButton type='highlight'>Test</MLButton>
              <>
                <h1>mlmessage buttons:</h1>
                <br />
                <MLButton type='primary' onClick={info}>
                  Info
                </MLButton><br />
                <MLButton onClick={success}>Success</MLButton><br />
                <MLButton onClick={error}>Error</MLButton><br />
                <MLButton onClick={warning}>Warning</MLButton><br />
                <MLButton onClick={loading}>Display a loading indicator</MLButton><br />
                <MLButton onClick={customIcon}>Custom icon</MLButton><br />
              </>
              <RouteSolid />
              <CheckCircleFilled />
              <div>
                <MLSlider tooltipPlacement='top' />
              </div>
              <MLDatePicker />
              <MLDatePicker picker='week' />
              <MLDatePicker size='small' />
              <MLDatePicker size='default' />
              <MLDatePicker size='large' />
              <MLPagination
                defaultCurrent={3}
                defaultPageSize={10}
                simple={false}
                size='default'
                total={50}
              />

              <MLResult type='primary' icon={<RouteSolid />} title='title' subTitle='subtitle' />
              <MLEmpty />
              <div
                style={{
                  width: '400px',
                }}
              >
                <MLEditableSlider
                  debounceTime={200}
                  defaultValue={0}
                  max={100}
                  min={0}
                  onChange={(v) => console.log(v)}
                />
                <MLEditableSlider
                  debounceTime={200}
                  defaultValue={[
                    20,
                    70,
                  ]}
                  max={100}
                  min={0}
                  range
                  onChange={(v) => console.log(v)}
                />
              </div>
              <div style={{ height: 2000 }}>Some tall content</div>
            </MLLayout.MLContent>
            <MLLayout.MLFooter year={2019} />
          </MLLayout>
          <SmileBeamSolid style={{ fontSize: '300px' }} />
        </MLConfigProvider>
      </div>
    )
  }
}
