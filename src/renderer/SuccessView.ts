/**
 * @fileOverview Success View
 */
import { ResultBaseView } from './ResultBaseView';

export class SuccessView extends ResultBaseView {
  public canvas: JQuery<Element>;

  constructor() {
    super(
      'success-view-container',
      'success-view-buttons',
      'success-view-home-button',
      'success-view-try-again-button'
    );
  }

}