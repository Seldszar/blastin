import clsx from "clsx";
import PropTypes from "prop-types";
import { useForm, Controller } from "react-hook-form";
import { useEffect, FunctionComponent, MouseEventHandler } from "react";

import { queryParser } from "lib/helpers";
import { FilterInstance } from "stores";

import Button from "./button";
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
  const { errors, handleSubmit, register, reset, control } = useForm({
    criteriaMode: "all",
    defaultValues: filter ?? {},
    mode: "onChange",
  });

  const handleDeleteClick: MouseEventHandler = (event) => {
    event.preventDefault();

    if (onDelete) {
      onDelete();
    }
  };

  useEffect(() => reset(filter ?? {}), [filter, reset]);

  return (
    <Modal title={`${filter ? "Update" : "Create"} Filter`} {...rest}>
      {({ close }) => (
        <form onSubmit={handleSubmit(close)}>
          <div className={styles.field}>
            <label>
              Title
              <input ref={register} className={styles.control} name="title" />
            </label>
          </div>

          <div className={styles.field}>
            <label>
              Query
              <textarea
                ref={register({
                  validate(value: string) {
                    if (value.length > 0) {
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
            </label>
          </div>

          <div className={styles.field}>
            <label>
              Icon
              <div className={styles.control}>
                <Controller as={<IconPicker />} name="icon" control={control} />
              </div>
            </label>
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
