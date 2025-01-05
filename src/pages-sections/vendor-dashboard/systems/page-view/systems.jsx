"use client";

import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import Button from '@mui/material/Button';
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer"; // GLOBAL CUSTOM COMPONENTS

import { H3 } from "components/Typography";
import Scrollbar from "components/Scrollbar";
import { TableHeader, TablePagination } from "components/data-table"; // GLOBAL CUSTOM HOOK
import { FlexBox } from "components/flex-box";

import useMuiTable from "hooks/useMuiTable"; 

import { getCookie, UID } from 'utils/cookies-utils';


// Local CUSTOM COMPONENT

import SystemRow from "../system-row";
import SearchArea from "../../search-box"; 

// CUSTOM DATA MODEL

// TABLE HEADING DATA LIST
const tableHeading = [{
  id: "name",
  label: "Name",
  align: "left"
}, {
  id: "api_key",
  label: "API Key",
  align: "left"
}, {
  id: "creation",
  label: "Creation",
  align: "left"
}, {
  id: "expiry",
  label: "Expiry",
  align: "left"
}, {
  id: "action",
  label: "Action",
  align: "center"
}]; // =============================================================================

// =============================================================================
const SystemsPageView = ({
  systems
}) => {

  const [ownerId, setOwnerId] = useState();
  const [systemList, setSystemList] = useState([]); // RESHAPE THE PRODUCT LIST BASED TABLE HEAD CELL ID

  const filteredSystems = systemList.map(item => ({
    id: item.id,
    name: item.name,
    api_key: item.api_key,
    created_at: item.created_at,
    expiry: item.expiry
  }));
  const {
    order,
    orderBy,
    selected,
    rowsPerPage,
    filteredList,
    handleChangePage,
    handleRequestSort
  } = useMuiTable({
    listData: filteredSystems
  });

  const [apiKeys, setApiKeys] = useState([]);

  useEffect(() => {
    setOwnerId(getCookie(UID));
  }, []);

  useEffect(() => {
    const fetchApiKeys = async () => {
      if (!ownerId) {
        console.error('ownerId is required');
        return;
      }
  
      try {
        const response = await fetch(`/api-keys/api-keys/api?ownerId=${ownerId}`);
        if (!response.ok) {
          const error = await response.json();
          console.error('Error fetching API keys:', error.error);
          return;
        }
        const data = await response.json();
        setApiKeys(data);
      } catch (error) {
        console.error('System error, try later:', error);
      }
    };
  
    fetchApiKeys();
  }, [ownerId]);

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this API key?')) {
      try {
        const response = await fetch(`/api-keys/api-keys/api`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: id }) // Send the ID in the request body
        });
  
        if (response.status === 200) {
          setApiKeys(apiKeys.filter(key => key.id !== id));
        } else {
          const error = await response.json();
          console.error("Error deleting API key:", error);
        }
      } catch (error) {
        console.error("System error, try later:", error);
      }
    }
  };

  const handleEdit = (id) => {
    console.log("delete: ", id);
    //router.push(`/api-keys/edit/${id}`);
  };

  return <Box py={4}>
    <H3 mb={2}>API Keys List</H3>

    <SearchArea handleSearch={() => { }} buttonText="Create API Key" url="/create" searchPlaceholder="Search project..." />
   
    <Card>
      <Scrollbar autoHide={false}>
        <TableContainer sx={{
          minWidth: 900
        }}>
          <Table>
            <TableHeader order={order} hideSelectBtn orderBy={orderBy} heading={tableHeading} rowCount={apiKeys.length} numSelected={selected.length} onRequestSort={handleRequestSort} />

            <TableBody>
              {apiKeys.map((system, index) => <SystemRow key={index} system={system} handleRowDelete={handleDelete} />)}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      {/* <Stack alignItems="center" my={4}>
        <TablePagination onChange={handleChangePage} count={Math.ceil(systems.length / rowsPerPage)} />
      </Stack> */}
    </Card>
  </Box>;
};

export default SystemsPageView;