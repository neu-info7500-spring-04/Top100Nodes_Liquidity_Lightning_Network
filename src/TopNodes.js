import React, { useState, useEffect } from 'react';
import './styles.css';

function TopNodesTable() {
    const [top100Nodes, setTop100Nodes] = useState([]);
    const [bitcoinValue, setBitcoinValue] = useState(null);

    const fetchData = async () => {
        try {
            const response = await fetch('https://mempool.space/api/v1/lightning/nodes/rankings/liquidity');
            const data = await response.json();
            setTop100Nodes(data);
            console.log(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const fetchBitcoinValue = async () => {
            try {
                const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json');
                const data = await response.json();
                setBitcoinValue(data.bpi.USD.rate_float);
            } catch (error) {
                console.error('Error fetching Bitcoin value:', error);
            }
        };
        
        fetchBitcoinValue();
    }, []);

    const roundToTwoDecimalPlaces = (number) => {
        return (number / 100000000).toFixed(2);
    };

    const USDConversion = (liquidity) => {
        return Math.floor((liquidity / 100000000) * bitcoinValue);
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000); // Convert to milliseconds
        return date.toLocaleString();
    };

    const renderCountry = (country) => {
        return country ? country.en : 'Unknown';
    };

    return (
        <div>
            <h1>Top 100 Nodes By Liquidity</h1>
            <table border="1">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Alias</th>
                        <th>Liquidity</th>
                        <th>USD</th>
                        <th>Channels</th>
                        <th>First Seen</th>
                        <th>Last Seen</th>
                        <th>Location</th>
                    </tr>
                </thead>
                <tbody>
                    {top100Nodes.map((node, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{node.alias}</td>
                            <td>{roundToTwoDecimalPlaces(node.capacity)}</td>
                            <td>{USDConversion(node.capacity)}</td>
                            <td>{node.channels}</td>
                            <td>{formatDate(node.firstSeen)}</td>
                            <td>{formatDate(node.updatedAt)}</td>
                            <td>{renderCountry(node.country)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TopNodesTable;
