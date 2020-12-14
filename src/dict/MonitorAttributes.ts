/**
 * This file contains a list of SEMP Attributes to monitor
 */

export function getVpnMonitorAttributeDictionary(sempVer: number) {
  if (sempVer < 2.13)
    return VPN_MONITOR_ATTRIBUTES_2_12;
  else
    return VPN_MONITOR_ATTRIBUTES_2_13;
}
 
export function getVpnClientMonitorAttributeDictionary(sempVer: number) {
  if (sempVer < 2.13)
    return CLIENT_MONITOR_ATTRIBUTES_2_12;
  else
    return CLIENT_MONITOR_ATTRIBUTES_2_13;
 }

export function getLabelForVpnClientMonitorAttribute(sempVer: number,attr:string) {
  if (sempVer < 2.13)
    return CLIENT_MONITOR_ATTRIBUTES_2_12.find((dict) => dict.id == attr).text;
  else
    return CLIENT_MONITOR_ATTRIBUTES_2_13.find((dict) => dict.id == attr).text;
}
 
export function getLabelForVpnMonitorAttribute(sempVer: number,attr:string) {
  if (sempVer < 2.13)
    return VPN_MONITOR_ATTRIBUTES_2_12.find((dict) => dict.id == attr).text;
  else
    return VPN_MONITOR_ATTRIBUTES_2_13.find((dict) => dict.id == attr).text;
 }

const  VPN_MONITOR_ATTRIBUTES_2_12 = 
    [
    /* Connection counts aren't part of the public monitor spec as of yet :( */
    // {id:'msgVpnConnections',text:'Connection Counts'},
    // {id:'msgVpnConnectionsServiceSmf',text:'Connection Count SMF'},
    // {id:'msgVpnConnectionsServiceWeb',text:'Connection Count Web'},
    // {id:'msgVpnConnectionsServiceMqtt',text:'Connection Count MQTT'},
    // {id:'msgVpnConnectionsServiceRestIncoming',text:'Connection Count REST Incoming'},
    // {id:'msgVpnConnectionsServiceRestOutgoing',text:'Connection Count REST Outgoing'},
    // {id:'connectionsServiceAmqp',text:'Connection Count AMQP'},
    {id:'rate.rxMsgRate',text:'Ingress Rate (msgs/second)'},
    {id:'rate.averageRxMsgRate',text:'Avg Ingress Rate (msgs/second)'},
    {id:'rate.rxByteRate',text:'Ingress Rate (bytes/second)'},
    {id:'rate.averageRxByteRate',text:'Avg Ingress Rate (bytes/second)'},
    {id:'rate.txMsgRate',text:'Egress Rate (msgs/second)'},
    {id:'rate.averageTxMsgRate',text:'Avg Egress Rate (msgs/second)'},
    {id:'rate.txByteRate',text:'Egress Rate (bytes/second)'},
    {id:'rate.averageTxByteRate',text:'Avg Egress Rate (bytes/second)'},
    {id:'counter.discardedRxMsgCount', text: 'Ingress Discards' },
    {id:'counter.discardedTxMsgCount',text:'Egress Discards'},
    {id:'counter.tlsRxByteCount',text:'TLS messages received'},
    {id:'counter.tlsTxByteCount',text:'TLS messages sent'},
    {id:'rate.tlsRxByteRate',text:'TLS ingress rate (bytes/second)'},
    {id:'rate.tlsTxByteRate',text:'TLS egress rate (bytes/second)'},
    {id:'rate.tlsAverageRxByteRate',text:'Avg TLS ingress rate (bytes/second)'},
    {id:'rate.tlsAverageTxByteRate',text:'Avg TLS egress rate (bytes/second)'},
    {id:'counter.rxMsgCount',text:'Total Ingress Client Messages'},
    {id:'counter.txMsgCount',text:'Total Egress Client Messages'},
    {id:'counter.dataRxMsgCount',text:'Ingress Client Data Messages'},
    {id:'counter.dataTxMsgCount',text:'Egress Client Data Messages'},
    {id:'counter.controlRxMsgCount',text:'Ingress Client Control Messages'},
    {id:'counter.controlTxMsgCount',text:'Egress Client Control Messages'},
    {id:'counter.loginRxMsgCount',text:'Ingress Login Messages'},
    {id:'counter.loginTxMsgCount',text:'Egress Login Messages'},
    {id:'counter.rxByteCount',text:'Ingress Total Messages (bytes)'},
    {id:'counter.txByteCount',text:'Egress Total Messages (bytes)'},
    {id:'counter.dataRxByteCount',text:'Ingress Total Client Data Messages (bytes)'},
    {id:'counter.dataTxByteCount',text:'Egress Total Client Data Messages (bytes)'},
    {id:'counter.controlRxByteCount',text:'Ingress Total Client Control Messages (bytes)'},
    {id:'counter.controlTxByteCount',text:'Egress Total Client Control Messages (bytes)'},    ];


     const CLIENT_MONITOR_ATTRIBUTES_2_12 = 
    [
    /* Connection counts aren't part of the public monitor spec as of yet :( */
    {id:'rate.rxMsgRate',text:'Ingress Rate (msgs/second)'},
    {id:'rate.averageRxMsgRate',text:'Avg Ingress Rate (msgs/second)'},
    {id:'rate.rxByteRate',text:'Ingress Rate (bytes/second)'},
    {id:'rate.averageRxByteRate',text:'Avg Ingress Rate (bytes/second)'},
    {id:'rate.txMsgRate',text:'Egress Rate (msgs/second)'},
    {id:'rate.averageTxMsgRate',text:'Avg Egress Rate (msgs/second)'},
    {id:'rate.txByteRate',text:'Egress Rate (bytes/second)'},
    {id:'rate.averageTxByteRate', text: 'Avg Egress Rate (bytes/second)' },
    {id:'counter.controlRxMsgCount',text:'Ingress Client Control Messages'},
    {id:'counter.controlTxMsgCount',text:'Egress Client Control Messages'},
    {id:'counter.controlRxByteCount',text:'Ingress Total Client Control Messages (bytes)'},
    {id:'counter.controlTxByteCount', text: 'Egress Total Client Control Messages (bytes)' },
    {id:'counter.dataRxMsgCount',text:'Ingress Client Data Messages'},
    {id:'counter.dataTxMsgCount',text:'Egress Client Data Messages'},
    {id:'counter.dataRxByteCount',text:'Ingress Total Client Data Messages (bytes)'},
    {id:'counter.dataTxByteCount',text:'Egress Total Client Data Messages (bytes)'},
    {id:'counter.discardedRxMsgCount', text: 'Ingress Discards' },
    {id:'counter.discardedTxMsgCount', text: 'Egress Discards'},
    {id:'counter.loginRxMsgCount',text:'Ingress Login Messages'},
    {id:'counter.loginTxMsgCount', text: 'Egress Login Messages' },
    {id:'counter.rxMsgCount',text:'Total Ingress Messages'},
    {id:'counter.txMsgCount',text:'Total Egress Messages'},
    {id:'counter.rxByteCount',text:'Ingress Total Messages (bytes)'},
    {id:'counter.txByteCount', text: 'Egress Total Messages (bytes)' },
    {id:'counter.webRxMsgCount',text:'Web Ingress Messages'},
    {id:'counter.webTxMsgCount',text:'Web Egress Messages'},
    {id:'counter.webRxByteCount',text:'Web Total Messages (bytes)'},
    {id:'counter.webTxByteCount',text:'Web Total Messages (bytes)'},

  ];

   const VPN_MONITOR_ATTRIBUTES_2_13 = 
    [
    /* Connection counts aren't part of the public monitor spec as of yet :( */
    // {id:'msgVpnConnections',text:'Connection Counts'},
    // {id:'msgVpnConnectionsServiceSmf',text:'Connection Count SMF'},
    // {id:'msgVpnConnectionsServiceWeb',text:'Connection Count Web'},
    // {id:'msgVpnConnectionsServiceMqtt',text:'Connection Count MQTT'},
    // {id:'msgVpnConnectionsServiceRestIncoming',text:'Connection Count REST Incoming'},
    // {id:'msgVpnConnectionsServiceRestOutgoing',text:'Connection Count REST Outgoing'},
    // {id:'connectionsServiceAmqp',text:'Connection Count AMQP'},
    {id:'rxMsgRate',text:'Ingress Rate (msgs/second)'},
    {id:'averageRxMsgRate',text:'Avg Ingress Rate (msgs/second)'},
    {id:'rxByteRate',text:'Ingress Rate (bytes/second)'},
    {id:'averageRxByteRate',text:'Avg Ingress Rate (bytes/second)'},
    {id:'txMsgRate',text:'Egress Rate (msgs/second)'},
    {id:'averageTxMsgRate',text:'Avg Egress Rate (msgs/second)'},
    {id:'txByteRate',text:'Egress Rate (bytes/second)'},
    {id:'averageTxByteRate',text:'Avg Egress Rate (bytes/second)'},
    {id:'discardedRxMsgCount', text: 'Ingress Discards' },
    {id:'discardedTxMsgCount',text:'Egress Discards'},
    {id:'tlsRxByteCount',text:'TLS messages received'},
    {id:'tlsTxByteCount',text:'TLS messages sent'},
    {id:'tlsRxByteRate',text:'TLS ingress rate (bytes/second)'},
    {id:'tlsTxByteRate',text:'TLS egress rate (bytes/second)'},
    {id:'tlsAverageRxByteRate',text:'Avg TLS ingress rate (bytes/second)'},
    {id:'tlsAverageTxByteRate',text:'Avg TLS egress rate (bytes/second)'},
    {id:'rxMsgCount',text:'Total Ingress Client Messages'},
    {id:'txMsgCount',text:'Total Egress Client Messages'},
    {id:'dataRxMsgCount',text:'Ingress Client Data Messages'},
    {id:'dataTxMsgCount',text:'Egress Client Data Messages'},
    {id:'controlRxMsgCount',text:'Ingress Client Control Messages'},
    {id:'controlTxMsgCount',text:'Egress Client Control Messages'},
    {id:'loginRxMsgCount',text:'Ingress Login Messages'},
    {id:'loginTxMsgCount',text:'Egress Login Messages'},
    {id:'rxByteCount',text:'Ingress Total Messages (bytes)'},
    {id:'txByteCount',text:'Egress Total Messages (bytes)'},
    {id:'dataRxByteCount',text:'Ingress Total Client Data Messages (bytes)'},
    {id:'dataTxByteCount',text:'Egress Total Client Data Messages (bytes)'},
    {id:'controlRxByteCount',text:'Ingress Total Client Control Messages (bytes)'},
    {id:'controlTxByteCount',text:'Egress Total Client Control Messages (bytes)'},
    {id:'rxCompressedByteCount',text:'Ingress Compressed Messages (bytes)'},
    {id:'txCompressedByteCount',text:'Egress Compressed Messages (bytes)'},
    {id:'rxUncompressedByteCount',text:'Ingress Uncompressed Messages (bytes)'},
    {id:'txUncompressedByteCount',text:'Egress Uncompressed Messages (bytes)'},
    {id:'rxCompressedByteRate',text:'Ingress Compressed Rate (1s)'},
    {id:'txCompressedByteRate',text:'Egress Compressed Rate (1s)'},
    {id:'rxUncompressedByteRate',text:'Ingress Uncompressed Rate (1s)'},
    {id:'txUncompressedByteRate',text:'Egress Uncompressed Rate (1s)'},
    {id:'averageRxCompressedByteRate',text:'Ingress Compressed Rate (60s)'},
    {id:'averageTxCompressedByteRate',text:'Egress Compressed Rate (60s)'},
    {id:'averageRxUncompressedByteRate',text:'Ingress Uncompressed Rate (60s)'},
    {id:'averageTxUncompressedByteRate',text:'Egress Uncompressed Rate (60s)'}];


     const CLIENT_MONITOR_ATTRIBUTES_2_13 = 
    [
    /* Connection counts aren't part of the public monitor spec as of yet :( */
    {id:'rxMsgRate',text:'Ingress Rate (msgs/second)'},
    {id:'averageRxMsgRate',text:'Avg Ingress Rate (msgs/second)'},
    {id:'rxByteRate',text:'Ingress Rate (bytes/second)'},
    {id:'averageRxByteRate',text:'Avg Ingress Rate (bytes/second)'},
    {id:'txMsgRate',text:'Egress Rate (msgs/second)'},
    {id:'averageTxMsgRate',text:'Avg Egress Rate (msgs/second)'},
    {id:'txByteRate',text:'Egress Rate (bytes/second)'},
    {id:'averageTxByteRate',text:'Avg Egress Rate (bytes/second)'},
    {id:'rxDiscardedMsgCount', text: 'Ingress Discards' },
    {id:'noSubscriptionMatchRxDiscardedMsgCount', text: 'Ingress No Subscription Match Discards' },
    {id:'topicParseErrorRxDiscardedMsgCount', text: 'Topic Parse Error Discards' },
    {id:'webParseErrorRxDiscardedMsgCount', text: 'Web Parse Error Discards' },
    {id:'publishTopicAclRxDiscardedMsgCount', text: 'Denied Publish Topic ACL Discards' },
    {id:'msgSpoolCongestionRxDiscardedMsgCount', text: 'Message Spool Congestion Discards' },
    {id:'msgSpoolRxDiscardedMsgCount', text: 'Message Spool Discards' },
    {id:'txDiscardedMsgCount',text:'Egress Discards'},
    {id:'rxMsgCount',text:'Total Ingress Client Messages'},
    {id:'txMsgCount',text:'Total Egress Client Messages'},
    {id:'dataRxMsgCount',text:'Ingress Client Data Messages'},
    {id:'dataTxMsgCount',text:'Egress Client Data Messages'},
    {id:'controlRxMsgCount',text:'Ingress Client Control Messages'},
    {id:'controlTxMsgCount',text:'Egress Client Control Messages'},
    {id:'loginRxMsgCount',text:'Ingress Login Messages'},
    {id:'loginTxMsgCount',text:'Egress Login Messages'},
    {id:'rxByteCount',text:'Ingress Total Messages (bytes)'},
    {id:'txByteCount',text:'Egress Total Messages (bytes)'},
    {id:'dataRxByteCount',text:'Ingress Total Client Data Messages (bytes)'},
    {id:'dataTxByteCount',text:'Egress Total Client Data Messages (bytes)'},
    {id:'controlRxByteCount',text:'Ingress Total Client Control Messages (bytes)'},
    {id:'controlTxByteCount',text:'Egress Total Client Control Messages (bytes)'},
  ];

