import React from 'react'
import PropTypes from 'prop-types'
import { InputNumber } from 'antd'
import MLSizeContext from '../MLConfigProvider/MLSizeContext'
import classNames from 'classnames'
import MLSlider from '../MLSlider'

const MLInputNumber = React.forwardRef((props, ref) => {
  return (
    <MLSizeContext.Consumer>
      {(contextSize) => {
        const size = contextSize || props.size
        return (
          <InputNumber
            ref={ref}
            {...props}
            size={size}
            className={classNames('ml-input-number', props.className)}
          >
            {props.children}
          </InputNumber>
        )
      }}
    </MLSizeContext.Consumer>
  )
})

MLInputNumber.propTypes = {
  autoFocus: PropTypes.bool,
  defaultValue: PropTypes.number,
  disabled: PropTypes.bool,
  formatter: PropTypes.func,
  max: PropTypes.number,
  min: PropTypes.number,
  parser: PropTypes.func,
  precision: PropTypes.number,
  decimalSeparator: PropTypes.string,
  size: PropTypes.string,
  step: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  value: PropTypes.number,
  onChange: PropTypes.func,
  onPressEnter: PropTypes.func,
}

MLInputNumber.displayName = 'MLInputNumber'

export default MLInputNumber
