import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ReactFlow, Background, MiniMap, Controls } from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import customNode from './custom-node';
import { H2 } from 'components/Typography';

const nodeTypes = {
    custom: customNode,
};

const TokenFlow = ({ tokenId }) => {
    const [tokenData, setTokenData] = useState({});

    useEffect(() => {
      const fetchTokenEvents = async () => {
        const tokenIdinBigInt = BigInt(tokenId);
        const query = `
          {
            tokenBurneds(where: {tokenId: "${tokenIdinBigInt}"}) {
                blockTimestamp
                amount
                tokenId
                owner
            }
            tokenMinteds(where: {tokenId: "${tokenIdinBigInt}"}) {
                id
                amount
                tokenId
                startDate
                owner
                endDate
                blockTimestamp
            }
            tokenTransferreds(where: {tokenId: "${tokenIdinBigInt}"}) {
                amount
                from
                to
                blockTimestamp
                tokenId
            }
            }
        `;
        const response = await axios.post(process.env.NEXT_PUBLIC_THEGRAPH_ENDPOINT, { query });
        console.log(response.data);
        setTokenData(response.data.data);
      };
  
      fetchTokenEvents();
    }, [tokenId]);

    const events = [
        ...(tokenData.tokenMinteds?.map((mint, index) => ({
            id: `issued-${index}`,
            type: 'Issue',
            amount: mint.amount,
            tokenId: mint.tokenId,
            blockTimestamp: mint.blockTimestamp
        })) || []),
        ...(tokenData.tokenBurneds?.map((burn, index) => ({
            id: `retired-${index}`,
            type: 'Retire',
            amount: burn.amount,
            tokenId: burn.tokenId,
            blockTimestamp: burn.blockTimestamp
        })) || []),
        ...(tokenData.tokenTransferreds?.map((transfer, index) => ({
            id: `transferred-${index}`,
            type: 'Transfer',
            amount: transfer.amount,
            tokenId: transfer.tokenId,
            blockTimestamp: transfer.blockTimestamp,
            from: transfer.from,
            to: transfer.to
        })) || [])
    ];

    // Sort events by blockTimestamp
    events.sort((a, b) => a.blockTimestamp - b.blockTimestamp);

    // Create nodes
    const nodes = events.map((event, index) => ({
        id: event.id,
        type: 'custom',
        data: { type: event.type, amount: event.amount, timestamp: event.blockTimestamp },
        position: { x: index * 0, y: index * 100 }
    }));

    // Create edges
    const edges = events.slice(1).map((event, index) => ({
        id: `edge-${index}`,
        source: events[index].id,
        target: event.id,
        //label: `${events[index].type} to ${event.type}`
    }));

    return (
        <div style={{ height: '500px' }}>
            <H2>History</H2>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                fitView
                className="bg-teal-50"
            >
                <MiniMap />
                <Controls />
            </ReactFlow>
        </div>
    );
};

export default TokenFlow;