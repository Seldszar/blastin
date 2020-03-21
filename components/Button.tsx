import clsx from 'clsx'
import PropTypes from 'prop-types'
import { FunctionComponent, DetailedHTMLProps, ButtonHTMLAttributes, forwardRef } from 'react'

import styles from "./Button.module.scss"

interface Props extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  block?: boolean;
  outline?: boolean;
  large?: boolean;
  theme?: string;
}

const Button: FunctionComponent<Props> = forwardRef(({ block, children, className, outline, large, theme = "default", ...rest }, ref) => (
  <button ref={ref} className={clsx(styles.wrapper, styles[theme], { [styles.block]: block, [styles.outline]: outline, [styles.large]: large }, className)} {...rest}>
    {children}
  </button>
))

Button.propTypes = {
  block: PropTypes.bool,
  outline: PropTypes.bool,
  theme: PropTypes.string,
  large: PropTypes.bool,
}

export default Button
