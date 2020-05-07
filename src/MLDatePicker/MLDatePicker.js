import React from 'react'
import PropTypes from 'prop-types'
import { get, isArray } from 'lodash-es'
import { DatePicker } from 'antd'
import { MLConfigContext } from '../MLConfigProvider'
import './style'
const { RangePicker } = DatePicker

const pickerPropsFromContext = ({ dateFormat, dateTimeFormat, weekFormat, monthFormat, yearFormat }, props) => {
  let format
  let { showTime } = props
  if (props.showTime && props.picker !== 'date') {
    console.warn("DatePicker: 'showTime' can only be used with 'date' picker")
    showTime = false
  }
  if (showTime === true) {
    // Use the first dateTimeFormat if multiple are provided, because TimePicker chokes on arrays of formats
    format = isArray(dateTimeFormat) ? dateTimeFormat[0] : dateTimeFormat
  } else {
    format = get({
      week: weekFormat,
      month: monthFormat,
      year: yearFormat,
      // Nothing special for quarter or year pickers
    }, props.picker, dateFormat)
  }
  return { format, showTime }
}

const MLDatePicker = (props) => {
  return (
    <MLConfigContext.Consumer>
      {(context) => {
        const contextProps = pickerPropsFromContext(context, props)
        return (
          <DatePicker {...contextProps} {...props} showTime={contextProps.showTime}>
            {props.children}
          </DatePicker>
        )
      }}
    </MLConfigContext.Consumer>
  )
}

MLDatePicker.defaultProps = {
  bordered: true,
  size: 'small',
}

MLDatePicker.propTypes = {
  bordered: PropTypes.bool,
  size: PropTypes.string,
}

const MLRangePicker = (props) => {
  return (
    <MLConfigContext.Consumer>
      {(context) => {
        const contextProps = pickerPropsFromContext(context, props)
        return (
          <RangePicker {...contextProps} {...props} showTime={contextProps.showTime}>
            {props.children}
          </RangePicker>
        )
      }}
    </MLConfigContext.Consumer>
  )
}

MLRangePicker.defaultProps = {
  bordered: true,
  placeholder: ['Start', 'End'],
  separator: (
    <span className='ant-picker-separator'>–</span> // en-dash
  ),
  size: 'small',
}

MLRangePicker.propTypes = {
  bordered: PropTypes.bool,
  placeholder: PropTypes.array,
  separator: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  size: PropTypes.string,
}

MLDatePicker.MLRangePicker = MLRangePicker

export default MLDatePicker
