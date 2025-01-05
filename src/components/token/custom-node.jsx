import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import MintIcon from '@mui/icons-material/AddCircleOutline';  // Example icon for Mint
import RetireIcon from '@mui/icons-material/HighlightOff';   // Example icon for Retire
import TransferIcon from '@mui/icons-material/SwapHoriz';    // Example icon for Transfer

import { parseTokenBalance } from 'utils/misc-utils';

const typeIcons = {
  Issue: <MintIcon style={{ color: 'green' }} />,
  Retire: <RetireIcon style={{ color: 'red' }} />,
  Transfer: <TransferIcon style={{ color: 'blue' }} />
};

function CustomNode({ data }) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400 flex">
      <div className="flex flex-col items-center">
        <div className="rounded-full px-1 py-1 flex justify-center items-center bg-gray-100">
          {typeIcons[data.type] || <div>❓</div>}
        </div>
        <div className="mt-1 text-center">
          <div className="text-sm text-gray-500">{data.type}</div>
        </div>
      </div>
      <div className="ml-4">
        <div className="text-lg font-bold">{parseTokenBalance(data.amount)}</div>
        <div className="text-gray-500">{new Date(data.timestamp * 1000).toLocaleString()}</div>
      </div>
      <Handle
        type="target"
        position={Position.Top}
        className="w-16 !bg-teal-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-16 !bg-teal-500"
      />
    </div>
  );
}

export default memo(CustomNode);