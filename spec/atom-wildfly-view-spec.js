'use babel';
/*jshint esversion: 6 */

import AtomWildflyView from '../lib/atom-wildfly-view';

describe('AtomWildflyView', () => {
  let atomWildflyView;

  beforeEach(() => {
    atomWildflyView = new AtomWildflyView();
  });

  it('should have valid getters', () => {
    expect(atomWildflyView.getElement()).toExist();
  });
});
