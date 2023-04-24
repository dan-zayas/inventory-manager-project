import { FC, ReactElement } from "react";
import { Table } from "antd";
import { DataProps } from "../utils/types";
import { ColumnsType } from "antd/lib/table/interface";

interface ContentLayoutProps {
  children?: React.ReactNode;
  pageTitle: string;
  setModalState?: (val: boolean) => void;
  dataSource: DataProps[];
  columns: ColumnsType<any>;
  fetching: boolean;
  customName?: string;
  extraButton?: ReactElement;
  disableAddButton?: boolean;
}

const ContentLayout: FC<ContentLayoutProps> = ({
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
  // Render the content layout with the table and the add button
  return (
    <>
      <div className="card">
        <div className="cardHeader">
          {/* Render the title */}
          <h1 className="headContent">
            {customName ? customName : `${pageTitle}s`}
          </h1>
          <div className="rightContent">
            {/* Render the search input */}
            <div className="searchInput">
              <input type="text" />
            </div>
            {/* Render the add button if not disabled */}
            {!disableAddButton && (
              <button onClick={() => setModalState && setModalState(true)}>
                Add {pageTitle}
              </button>
            )}
            {/* Render the extra button if provided */}
            {extraButton}
          </div>
        </div>

        <br />

        {/* Render the table with provided data and columns */}
        <Table dataSource={dataSource} columns={columns} loading={fetching} />
      </div>

      {/* Render any children components */}
      {children}
    </>
  );
};

export default ContentLayout;
