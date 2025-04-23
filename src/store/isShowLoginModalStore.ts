import { Store } from '@tanstack/store';

export const isShowLoginModalStore = new Store(false);

export function setIsShowLoginModalStore(isShow: boolean) {
  isShowLoginModalStore.setState(() => isShow);
}
