import clsx from "clsx";
import PropTypes from "prop-types";
import { DetailedHTMLProps, ButtonHTMLAttributes, forwardRef, ReactNode } from "react";

import styles from "./button.module.scss";

export interface ButtonProps
  extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  children: ReactNode;
  block?: boolean;
  outline?: boolean;
  large?: boolean;
  theme?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ block, children, className, outline, large, theme = "default", ...rest }, ref) => (
    <button
      ref={ref}
      className={clsx(
        styles.wrapper,
        styles[theme],
        {
          [styles.block]: block,
          [styles.outline]: outline,
          [styles.large]: large,
        },
        className
      )}
      {...rest}
    >
      {children}
    </button>
  )
);

Button.propTypes = {
  block: PropTypes.bool,
  outline: PropTypes.bool,
  theme: PropTypes.string,
  large: PropTypes.bool,
};

export default Button;
