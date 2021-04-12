import { observer } from "mobx-react-lite";
import { FunctionComponent, MouseEventHandler } from "react";

import { useStore } from "@/stores";

import Button from "./button";
import Modal, { ModalProps } from "./modal";

import styles from "./settings-modal.module.scss";

interface SettingsModalProps extends Omit<ModalProps, "children"> {
  className?: string;
}

const SettingsModal: FunctionComponent<SettingsModalProps> = ({ ...rest }) => {
  const store = useStore();

  const handleImport: MouseEventHandler<HTMLButtonElement> = () => {
    const element = document.createElement("input");

    element.type = "file";
    element.multiple = false;

    element.onchange = async () => {
      try {
        if (element.files && element.files.length > 0) {
          store.importFilters(JSON.parse(await element.files[0].text()));
        }
      } catch (error) {
        console.error(error);
      }

      element.remove();
    };

    element.click();
  };

  const handleExport: MouseEventHandler<HTMLButtonElement> = () => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(store.exportFilters())], {
      type: "application/json",
    });

    element.href = URL.createObjectURL(file);
    element.download = "filters.json";

    element.click();
    element.remove();

    URL.revokeObjectURL(element.href);
  };

  return (
    <Modal title="Settings" {...rest}>
      {() => (
        <div className={styles.field}>
          <div className={styles.buttons}>
            <div className={styles.button}>
              <Button block onClick={handleImport}>
                Import Filters
              </Button>
            </div>
            <div className={styles.button}>
              <Button block onClick={handleExport}>
                Export Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default observer(SettingsModal);
