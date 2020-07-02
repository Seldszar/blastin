import clsx from "clsx";
import PropTypes from "prop-types";
import { FunctionComponent, ReactNode, useRef } from "react";
import { useScroll } from "react-use";

import styles from "./scroller.module.scss";

interface Props {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}

const Scroller: FunctionComponent<Props> = ({ children, className, innerClassName }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { y } = useScroll(scrollRef);

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({
      behavior: "smooth",
      top: 0,
    });
  };

  return (
    <div className={clsx(styles.wrapper, className)}>
      <div ref={scrollRef} className={clsx(styles.inner, innerClassName)}>
        {children}
      </div>

      {y > 0 && (
        <div className={styles.scrollButton} onClick={scrollToTop}>
          Scroll To Top
        </div>
      )}
    </div>
  );
};

Scroller.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  innerClassName: PropTypes.string,
};

export default Scroller;
