import clsx from "clsx";
import PropTypes from "prop-types";
import { FunctionComponent } from "react";

interface IconProps {
  className?: string;
  name: string;
}

const Icon: FunctionComponent<IconProps> = ({ className, name }) => (
  <span className={clsx(`ms-Icon ms-Icon--${name}`, className)} />
);

Icon.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
};

export default Icon;
