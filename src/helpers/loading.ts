import { useDispatch } from 'context';
import { ActionTypes, DispatchType } from 'context/reducer';

export class Loading {
  private dispatch: DispatchType;

  constructor(dispatch: DispatchType) {
    this.dispatch = dispatch;
  }

  public show() {
    this.dispatch({ type: ActionTypes.loading, loading: true });
  }

  public hide() {
    this.dispatch({ type: ActionTypes.loading, loading: false });
  }
}

export function useLoading() {
  const dispatch = useDispatch();
  const loading = new Loading(dispatch);
  return loading;
}
