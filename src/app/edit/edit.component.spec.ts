import { EditComponent } from './edit.component';

describe('EditComponent', () => {

  describe('toDate', () => {

    it('should convert date to string', () => {
      const dateSrc = 0;

      const date = new Date(dateSrc);

      expect(date.toLocaleDateString()).toEqual('1/1/1970');
    });
  });
});
