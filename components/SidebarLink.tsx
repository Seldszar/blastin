import clsx from "clsx"
import Link from 'next/link'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { FunctionComponent, forwardRef } from "react"

import styles from "./SidebarLink.module.scss"

interface Props {
  as?: string;
  className?: string;
  href?: string;
  icon: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  title?: string;
  unread?: number;
  opaque?: boolean;
}

const SidebarLinkInner = forwardRef<HTMLDivElement, any>((props, ref) => (
  <div ref={ref} className={clsx(styles.wrapper, { [styles.opaque]: props.opaque }, props.className)} onClick={props.onClick}>
    <div className={clsx(styles.inner, { [styles.active]: props.active })}>
      <div className={styles.icon}>
        <span className={`ms-Icon ms-Icon--${props.icon}`} />
      </div>

      {props.unread > 0 && (
        <div className={styles.unreadBadge}>
          {props.unread}
        </div>
      )}
    </div>
  </div>
))

const SidebarLink: FunctionComponent<Props> = props => {
  const router = useRouter()

  const url = props.as ?? props.href
  const active = router.asPath === url

  if (url) {
    return (
      <Link as={props.as} href={props.href}>
        <SidebarLinkInner {...props} active={active} />
      </Link>
    )
  }

  return (
    <SidebarLinkInner {...props} active={active} />
  )
}

SidebarLink.propTypes = {
  as: PropTypes.string,
  className: PropTypes.string,
  href: PropTypes.string,
  icon: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
  unread: PropTypes.number,
  opaque: PropTypes.bool,
}

export default SidebarLink
