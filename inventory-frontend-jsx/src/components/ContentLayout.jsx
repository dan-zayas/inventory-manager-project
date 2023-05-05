import { Table } from "antd";

const ContentLayout = ({
  children,
  pageTitle,
  setModalState,
  dataSource,
  columns,
  fetching,
  customName,
  extraButton,
  disableAddButton = false,
}) => {
  return (
    <>
      <div className="card">
        <div className="cardHeader">
          <h1 className="headContent">
            {customName ? customName : `${pageTitle}s`}
          </h1>
          <div className="rightContent">
            <div className="searchInput">
              <input type="text" />
            </div>
            {!disableAddButton && (
              <button onClick={() => setModalState && setModalState(true)}>
                Add {pageTitle}
              </button>
            )}
            {extraButton}
          </div>
        </div>
        <br />
        <Table dataSource={dataSource} columns={columns} loading={fetching} />
      </div>
      {children}
    </>
  );
};

export default ContentLayout;
