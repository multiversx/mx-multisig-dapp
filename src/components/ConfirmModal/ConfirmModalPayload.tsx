export class ConfirmModalPayload {
  showPromiseResolution = (result: boolean) => {  };

  show(title: string, confirmButtonTitle: string) : Promise<boolean> {
    this.handleModalShow(title, confirmButtonTitle);

    return new Promise(resolve => {
      this.showPromiseResolution = resolve;
    });
  }

  handleModalShow = (title: string, confirmButtonTitle: string) => {};

  handleModalClose() {
    this.showPromiseResolution(false);
  }

  handleModalConfirm() {
    this.showPromiseResolution(true);
  }
}

let confirmModal = new ConfirmModalPayload();

export function useConfirmModal() {
  return confirmModal;
}