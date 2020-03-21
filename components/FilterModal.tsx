import clsx from 'clsx'
import PropTypes from 'prop-types'
import { useForm, Controller } from "react-hook-form"
import { useEffect, FunctionComponent, MouseEventHandler } from 'react'

import { FilterInstance } from '~/stores'

import IconPicker from './IconPicker'
import Modal from "./Modal"
import Button from './Button'

import styles from "./FilterModal.module.scss"

interface Props {
  className?: string;
  filter: FilterInstance;
  isOpen?: boolean;
  onClose?: (value?: Partial<FilterInstance>) => void;
  onDelete?: () => void;
}

const FilterModal: FunctionComponent<Props> = ({ filter, onDelete, ...rest }) => {
  const { handleSubmit, register, reset, control } = useForm({
    defaultValues: filter ?? {},
  })

  const handleDeleteClick: MouseEventHandler = event => {
    event.preventDefault()

    if (onDelete) {
      onDelete()
    }
  }

  useEffect(() => reset(filter ?? {}), [filter])

  return (
    <Modal title={`${filter ? "Update" : "Create"} Filter`} {...rest}>
      {({ close }) => (
        <form onSubmit={handleSubmit(close)}>
          <div className={styles.field}>
            <label>Title
            <input className={styles.control} name="title" ref={register} />
            </label>
          </div>

          <div className={styles.field}>
            <label>Query
            <textarea className={clsx(styles.control, styles.queryInput)} name="query" ref={register} />
            </label>
          </div>

          <div className={styles.field}>
            <label>Icon
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
  )
}

FilterModal.propTypes = {
  filter: PropTypes.any,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onDelete: PropTypes.func,
}

export default FilterModal
