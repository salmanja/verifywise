import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
  Typography,
  LinearProgress,
  useTheme,
} from "@mui/material";
import singleTheme from "../../../themes/v1SingleTheme";
import { Fragment, useCallback, useMemo, useState } from "react";
import NewControlPane from "../../Modals/Controlpane/NewControlPane";

interface ITableCol {
  id: number;
  name: string;
}

const AccordionTable = ({
  id,
  cols,
  rows,
  controlCategory,
}: {
  id: any;
  cols: ITableCol[];
  rows: any[];
  controlCategory: string;
}) => {
  const theme = useTheme();
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const getProgressColor = useCallback((value: number) => {
    if (value <= 10) return "#FF4500"; // 0-10%
    if (value <= 20) return "#FF4500"; // 11-20%
    if (value <= 30) return "#FFA500"; // 21-30%
    if (value <= 40) return "#FFD700"; // 31-40%
    if (value <= 50) return "#E9F14F"; // 41-50%
    if (value <= 60) return "#CDDD24"; // 51-60%
    if (value <= 70) return "#64E730"; // 61-70%
    if (value <= 80) return "#32CD32"; // 71-80%
    if (value <= 90) return "#228B22"; // 81-90%
    return "#008000"; // 91-100%
  }, []);

  const tableHeader = useMemo(
    () => (
      <TableHead
        id={`${id}-table-header`}
        className="accordion-table-header"
        sx={{
          backgroundColors:
            singleTheme.tableStyles.primary.header.backgroundColors,
        }}
      >
        <TableRow className="accordion-table-header-row">
          {cols.map((col: ITableCol) => (
            <TableCell
              className="accordion-table-header-cell"
              style={singleTheme.tableStyles.primary.header.cell}
              key={col.id}
            >
              {col.name}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    ),
    [cols, id]
  );

  const cellStyle = {
    ...singleTheme.tableStyles.primary.body.row,
    height: "36px",
    "&:hover": {
      backgroundColor: "#FBFBFB",
      cursor: "pointer",
    },
  };

  const handleRowClick = (id: number) => {
    setSelectedRow(id);
    setModalOpen(true);
  };

  const tableBody = useMemo(
    () => (
      <TableBody id={`${id}-table-body`} className="accordion-table-body">
        {rows.map((row) => (
          <Fragment key={row.id}>
            {modalOpen && selectedRow === row.id && (
              <NewControlPane
                id={row.id}
                numbering={`${id}.${row.id}`}
                isOpen={modalOpen}
                handleClose={() => setModalOpen(false)}
                title={row.title}
                content={row.description}
                subControls={row.subControls}
                OnSave={() => {
                  console.log("Save clicked");
                  // fetchComplianceTracker();
                }}
                controlCategory={controlCategory}
              />
            )}
            <TableRow
              className="accordion-table-body-row"
              key={`${id}-${row.id}-row`}
              sx={cellStyle}
              onClick={() => handleRowClick(row.id)}
            >
              {row.icon && (
                <TableCell sx={cellStyle} key={`icon-${row.id}`}>
                  <img src={row.icon} alt="status icon" width={20} />
                </TableCell>
              )}
              {row.title && (
                <TableCell sx={cellStyle} key={`${id}-${row.id}`}>
                  {id}.{row.id} {row.title}{" "}
                  {`(${row.description}`.substring(0, 20) + `...)`}
                </TableCell>
              )}
              {row.owner && (
                <TableCell sx={cellStyle} key={`owner-${row.id}`}>
                  {row.owner}
                </TableCell>
              )}
              {row.noOfSubControls && (
                <TableCell sx={cellStyle} key={`noOfSubControls-${row.id}`}>
                  {row.noOfSubControls}
                </TableCell>
              )}
              {row.completion && (
                <TableCell sx={cellStyle} key={`completion-${row.id}`}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="body2">{row.completion} </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={parseFloat(row.completion)}
                      sx={{
                        width: "100px",
                        height: "5px",
                        borderRadius: "4px",
                        backgroundColor: theme.palette.grey[200],
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: getProgressColor(
                            parseFloat(row.completion)
                          ),
                        },
                      }}
                    />
                  </Stack>
                </TableCell>
              )}
            </TableRow>
          </Fragment>
        ))}
      </TableBody>
    ),
    [rows, modalOpen, selectedRow, getProgressColor, theme.palette.grey, id]
  );

  return (
    <TableContainer className="accordion-table-container">
      <Table className="accordion-table">
        {tableHeader}
        {tableBody}
      </Table>
    </TableContainer>
  );
};

export default AccordionTable;
