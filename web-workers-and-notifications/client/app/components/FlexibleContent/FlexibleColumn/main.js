import styles from './main.scss';

const FlexibleColumn = ({ children }) =>
  <div className={styles['flexible-column']}>{children}</div>
;

FlexibleColumn.displayName = 'FlexibleColumn';
FlexibleColumn.defaultProps = {
  align: 'center',
};

FlexibleColumn.propTypes = {
  children: PropTypes.node,

  // this prop is used by the parent: "flexible-row".
  align: PropTypes.oneOf(['left', 'center', 'right']), // eslint-disable-line react/no-unused-prop-types
};

export default FlexibleColumn;
