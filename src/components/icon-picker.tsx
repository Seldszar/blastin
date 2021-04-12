import clsx from "clsx";
import PropTypes from "prop-types";
import { FunctionComponent, useState } from "react";
import { AutoSizer, List } from "react-virtualized";

import icons from "@/data/icons.json";

import Icon from "./icon";

import styles from "./icon-picker.module.scss";

interface Props {
  className?: string;
  onChange?: (icon: string) => void;
  value?: string;
}

const IconPicker: FunctionComponent<Props> = ({ className, value, onChange }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredIcons = icons.filter((icon) =>
    searchQuery ? new RegExp(searchQuery, "i").test(icon) : true
  );
  const rows = new Array<string[]>();

  let selectedRow = 0;

  for (let index = 0; index < filteredIcons.length; index += 6) {
    const row = filteredIcons.slice(index, index + 6);

    if (row.some((icon) => icon === value)) {
      selectedRow = rows.length;
    }

    rows.push(row);
  }

  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        className={styles.inputField}
        placeholder="Filter icons..."
        onChange={({ target }) => setSearchQuery(target.value)}
      />
      <AutoSizer disableHeight>
        {({ width }) => (
          <List
            className={clsx(styles.wrapper, className)}
            scrollToAlignment="center"
            height={256}
            rowCount={rows.length}
            rowHeight={60}
            width={width}
            scrollToIndex={selectedRow}
            style={{ overflowX: "auto" }}
            rowRenderer={({ key, index, style }) => (
              <div key={key} className={styles.row} style={style}>
                {rows[index].map((icon) => (
                  <div key={icon} className={styles.item}>
                    <div
                      className={clsx(styles.icon, {
                        [styles.selected]: value === icon,
                      })}
                      onClick={() => onChange?.(icon)}
                    >
                      <Icon name={icon} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          />
        )}
      </AutoSizer>
    </div>
  );
};

IconPicker.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
};

export default IconPicker;
