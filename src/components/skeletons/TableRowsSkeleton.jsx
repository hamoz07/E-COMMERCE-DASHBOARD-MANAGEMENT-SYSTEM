import Skeleton from "../ui/Skeleton/Skeleton";

export const TableLoadingRows = ({ columnCount, rowCount = 5 }) =>
  Array.from({ length: rowCount }, (_, rowIndex) => (
    <tr key={`table-loading-row-${rowIndex}`}>
      {Array.from({ length: columnCount }, (_, columnIndex) => (
        <td key={`table-loading-cell-${rowIndex}-${columnIndex}`}>
          <Skeleton width={columnIndex === 0 ? "35px" : "75%"} height="16px" />
        </td>
      ))}
    </tr>
  ));