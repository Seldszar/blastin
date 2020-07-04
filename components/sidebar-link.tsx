import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { FunctionComponent, forwardRef } from "react";

import Icon from "./icon";

import styles from "./sidebar-link.module.scss";

interface SidebarLinkInnerProps {
  className?: string;
  icon: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  title?: string;
  unread?: number;
  isOpaque?: boolean;
  active: boolean;
}

const SidebarLinkInner = forwardRef<HTMLDivElement, SidebarLinkInnerProps>((props, ref) => (
  <div
    ref={ref}
    className={clsx(styles.wrapper, { [styles.opaque]: props.isOpaque }, props.className)}
    onClick={props.onClick}
  >
    <div className={clsx(styles.inner, { [styles.active]: props.active })}>
      <div className={styles.icon}>
        <Icon name={props.icon} />
      </div>

      {(props.unread ?? 0) > 0 && <div className={styles.unreadBadge}>{props.unread}</div>}
    </div>
  </div>
));

interface SidebarLinkProps {
  as?: string;
  className?: string;
  href?: string;
  icon: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  title?: string;
  unread?: number;
  isOpaque?: boolean;
}

const SidebarLink: FunctionComponent<SidebarLinkProps> = (props) => {
  const router = useRouter();

  const url = props.as ?? props.href;
  const active = router.asPath === url;

  if (props.href) {
    return (
      <Link as={props.as} href={props.href}>
        <SidebarLinkInner {...props} active={active} />
      </Link>
    );
  }

  return <SidebarLinkInner {...props} active={active} />;
};

SidebarLink.propTypes = {
  as: PropTypes.string,
  className: PropTypes.string,
  href: PropTypes.string,
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  title: PropTypes.string,
  unread: PropTypes.number,
  isOpaque: PropTypes.bool,
};

export default SidebarLink;
