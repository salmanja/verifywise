import "./index.css";
import { Button, Stack, Typography, useTheme } from "@mui/material";
import TableWithPlaceholder from "../../components/Table/WithPlaceholder/index";
import { Suspense, useCallback, useContext, useEffect, useState } from "react";

import AddNewVendor from "../../components/Modals/NewVendor";
import singleTheme from "../../themes/v1SingleTheme";
import { VerifyWiseContext } from "../../../application/contexts/VerifyWise.context";
import { deleteEntityById, getAllEntities } from "../../../application/repository/entity.repository";
import { logEngine } from "../../../application/tools/log.engine";
import Alert from "../../components/Alert";

const Vendors = () => {
    const theme = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [value, setValue] = useState("1");
    const [vendorChangeTrigger, setVendorChangeTrigger] = useState(0);
    const { dashboardValues, setDashboardValues } = useContext(VerifyWiseContext);
    const [alert, setAlert] = useState<{
        variant: "success" | "info" | "warning" | "error";
        title?: string;
        body: string;
    } | null>(null);

    const openAddNewVendor = () => {
        setIsOpen(true);
    };

    const handleChange = (_: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    const fetchVendors = useCallback(async () => {
        try {
            const response = await getAllEntities({ routeUrl: "/vendors" });
            console.log("response ===> ", response);
            setDashboardValues((prevValues: any) => ({
                ...prevValues,
                vendors: response.data,
            }));
        } catch (error) {
            console.error("Error fetching vendors:", error);
        }
    }, [setDashboardValues]);

    useEffect(() => {
        fetchVendors();
    }, [fetchVendors, vendorChangeTrigger]);

    const updateVendorChangeTrigger = () => {
        setVendorChangeTrigger(prev => prev + 1);
    };

    // const handleEditVendor = async (vendorId: number, updatedVendorDetails: VendorDetails) => {
    //     try {
    //         await editVendor(vendorId, updatedVendorDetails);
    //         setVendorChangeTrigger(prev => prev + 1); // Increment to trigger re-fetch
    //     } catch (error) {
    //         console.error("Error editing vendor:", error);
    //     }
    // };

    const handleDeleteVendor = async (vendorId: number) => {
        const user = {
            id: "At delete vendor level", // Replace with actual user ID
            email: "N/A", // Replace with actual user email
            firstname: "N/A", // Replace with actual user first name
            lastname: "N/A", // Replace with actual user last name
        };

        try {
            const response = await deleteEntityById({
                routeUrl: `/vendors/${vendorId}`,
            });

            if (response.status === 202) {
                setDashboardValues((prevValues: any) => ({
                    ...prevValues,
                    vendors: prevValues.vendors.filter(
                        (vendor: any) => vendor.id !== vendorId
                    ),
                }));
                setAlert({
                    variant: "success",
                    body: "Vendor deleted successfully.",
                });
                setTimeout(() => {
                    setAlert(null);
                }, 3000);
                updateVendorChangeTrigger();
            } else if (response.status === 404) {
                setAlert({
                    variant: "error",
                    body: "Vendor not found.",
                });
                setTimeout(() => {
                    setAlert(null);
                }, 3000);
            } else {
                console.error("Unexpected response. Please try again.");
                logEngine({
                    type: "error",
                    message: "Unexpected response. Please try again.",
                    user,
                });
            }
        } catch (error) {
            console.error("Error deleting vendor:", error);
            logEngine({
                type: "error",
                message: `An error occurred: ${error}`,
                user,
            });
        }
    };

    return (
        <div className="vendors-page">
            <Stack gap={theme.spacing(10)} maxWidth={1400}>
                {alert && (
                    <Suspense fallback={<div>Loading...</div>}>
                        <Alert
                            variant={alert.variant}
                            title={alert.title}
                            body={alert.body}
                            isToast={true}
                            onClick={() => setAlert(null)}
                        />
                    </Suspense>
                )}
                <Stack>
                    <Typography sx={singleTheme.textStyles.pageTitle}>
                        Vendors list
                    </Typography>
                    <Typography sx={singleTheme.textStyles.pageDescription}>
                        This table includes a list of external entity that provides
                        AI-related products, services, or components. You can create and
                        manage all vendors here.
                    </Typography>
                </Stack>
                <Stack
                    sx={{
                        alignItems: "flex-end",
                    }}
                >
                    <Button
                        disableRipple={
                            theme.components?.MuiButton?.defaultProps?.disableRipple
                        }
                        variant="contained"
                        sx={{
                            ...singleTheme.buttons.primary,
                            width: 150,
                            height: 34,
                            "&:hover": {
                                backgroundColor: "#175CD3 ",
                            },
                        }}
                        onClick={() => {
                            openAddNewVendor();
                        }}
                    >
                        Add new vendor
                    </Button>
                </Stack>
                <TableWithPlaceholder
                    dashboardValues={dashboardValues}
                    onVendorChange={updateVendorChangeTrigger}
                    onDeleteVendor={handleDeleteVendor} />
            </Stack>
            <AddNewVendor
                isOpen={isOpen}
                handleChange={handleChange}
                setIsOpen={() => setIsOpen(false)}
                value={value}
                onVendorChange={updateVendorChangeTrigger}
            />
        </div>
    );
};

export default Vendors;
