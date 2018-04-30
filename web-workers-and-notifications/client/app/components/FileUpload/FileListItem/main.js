import { FlexibleColumn, FlexibleRow } from '../../FlexibleContent';

import styles from './main.scss';

const cx = classnames.bind(styles);

const FileListItem = ({ name, status }) =>
  <div
    className={cx('file-list-item', {
      [`status-${status}`]: !!status,
    })}
  >
    <FlexibleRow centerItems='vertical'>
      <FlexibleColumn align='left'>
        <div className={styles['file-list-item--name']}>
          <span>{name}</span>
        </div>
      </FlexibleColumn>
      <FlexibleColumn align='center'>
        <div className={styles['file-list-item--icon']}>
          <i />
        </div>
      </FlexibleColumn>
    </FlexibleRow>
  </div>
;

export default FileListItem;
