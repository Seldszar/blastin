import clsx from "clsx";
import { cast } from "mobx-state-tree";
import PropTypes from "prop-types";
import { useForm, Controller } from "react-hook-form";
import { useEffect, FunctionComponent, MouseEventHandler, useMemo } from "react";

import { queryParser } from "lib/helpers";
import { FilterInstance, useStore } from "stores";

import Button from "./button";
import EventList from "./event-list";
import IconPicker from "./icon-picker";
import Modal, { ModalProps } from "./modal";

import styles from "./filter-modal.module.scss";

interface FilterModalProps extends Omit<ModalProps, "children"> {
  className?: string;
  filter: FilterInstance | null;
  onClose?: (value?: Partial<FilterInstance>) => void;
  onDelete?: () => void;
}

const FilterModal: FunctionComponent<FilterModalProps> = ({ filter, onDelete, ...rest }) => {
  const { control, errors, handleSubmit, register, reset, watch } = useForm({
    criteriaMode: "all",
    defaultValues: filter ?? {},
    mode: "onChange",
  });

  const store = useStore();
  const query = watch("query");

  const filteredEvents = useMemo(() => {
    let events = store.events.toJSON();

    try {
      if (query) {
        events = events.filter((event) => Boolean(queryParser.evaluate(query, cast(event))));
      }
    } catch {
      // ...
    }

    return events;
  }, [query]);

  const handleDeleteClick: MouseEventHandler = (event) => {
    event.preventDefault();

    if (onDelete) {
      onDelete();
    }
  };

  useEffect(() => reset(filter ?? {}), [filter, reset]);

  return (
    <Modal large title={`${filter ? "Update" : "Create"} Filter`} {...rest}>
      {({ close }) => (
        <form onSubmit={handleSubmit(close)}>
          <div className={styles.columns}>
            <div className={styles.column}>
              <div className={styles.field}>
                <div className={styles.label}>Title</div>
                <input ref={register} className={styles.control} name="title" />
              </div>

              <div className={styles.field}>
                <div className={styles.label}>Query</div>
                <textarea
                  ref={register({
                    validate(value: string) {
                      if (value) {
                        try {
                          queryParser.parse(value);
                        } catch (error) {
                          return error.message;
                        }
                      }

                      return true;
                    },
                  })}
                  className={clsx(styles.control, styles.queryInput, {
                    [styles.error]: errors.query,
                  })}
                  name="query"
                />
              </div>

              <div className={styles.field}>
                <div className={styles.label}>Icon</div>
                <div className={styles.control}>
                  <Controller as={<IconPicker />} name="icon" control={control} />
                </div>
              </div>
            </div>
            <div className={clsx(styles.column, styles.filteredEventsColumn)}>
              <div className={styles.field}>
                <div className={styles.label}>Query Preview</div>
                <div className={styles.control}>
                  <div className={styles.filteredEvents}>
                    <EventList small events={filteredEvents} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.buttons}>
            <Button className={styles.button} type="submit">
              {filter ? "Update" : "Create"}
            </Button>

            {filter && (
              <Button className={styles.button} theme="delete" onClick={handleDeleteClick}>
                Remove
              </Button>
            )}

            <Button className={styles.button} theme="link" onClick={() => close()}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

FilterModal.propTypes = {
  filter: PropTypes.any,
  onDelete: PropTypes.func,
};

export default FilterModal;
