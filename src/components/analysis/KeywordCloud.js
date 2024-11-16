import React, { useEffect, useRef } from 'react';
import { WebView } from 'react-native-webview';
import { View } from 'react-native';

const KeywordCloud = ({ words }) => {
    const webViewRef = useRef(null);

    useEffect(() => {
        if (webViewRef.current && words) {
            const jsonData = JSON.stringify(words);
            webViewRef.current.postMessage(jsonData);
        }
    }, [words]);

    return (
        <View style={{ flex: 1 }}>
            <WebView
                ref={webViewRef}
                originWhitelist={['*']}
                source={{
                    html: `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Keyword Cloud</title>
                        <style>
                            #word-cloud {
                                width: 100vw;
                                height: 100vh;
                            }
                        </style>
                        <script src="https://d3js.org/d3.v6.min.js"></script>
                        <script src="https://cdnjs.cloudflare.com/ajax/libs/d3-cloud/1.2.5/d3.layout.cloud.min.js"></script>
                    </head>
                    <body>
                        <div id="word-cloud"></div>
                        <script>
                            document.addEventListener("message", function(event) {
                                const data = JSON.parse(event.data);
                                console.log("Data received from React Native:", data);
                                generateWordCloud(data);
                            });

                            function generateWordCloud(data) {
                                const width = window.innerWidth;
                                const height = window.innerHeight;

                                d3.select("#word-cloud").html("");

                                const svg = d3.select("#word-cloud")
                                    .append("svg")
                                    .attr("width", width)
                                    .attr("height", height);

                                const layout = d3.layout.cloud()
                                    .size([width, height])
                                    .words(data.map(d => ({ text: d.keyword, size: 10 + d.count * 5 })))
                                    .padding(5)
                                    .rotate(() => ~~(Math.random() * 2) * 90)
                                    .font("Arial")
                                    .fontSize(d => d.size)
                                    .on("end", draw);

                                layout.start();

                                function draw(words) {
                                    svg.append("g")
                                        .attr("transform", "translate(" + [width / 2, height / 2] + ")")
                                        .selectAll("text")
                                        .data(words)
                                        .enter().append("text")
                                        .style("font-size", d => d.size + "px")
                                        .style("fill", () => "hsl(" + Math.random() * 360 + ", 100%, 50%)")
                                        .attr("text-anchor", "middle")
                                        .attr("transform", d => "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")")
                                        .text(d => d.text);
                                }
                            }
                        </script>
                    </body>
                    </html>
                `
                }}
                style={{ height: 300, width: '100%' }}
                javaScriptEnabled={true}
                onLoad={() => {
                    if (webViewRef.current && words) {
                        const jsonData = JSON.stringify(words);
                        webViewRef.current.postMessage(jsonData);
                    }
                }}
                onError={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    console.warn('WebView error: ', nativeEvent.description);
                }}
                onHttpError={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    console.warn('WebView HTTP error: ', nativeEvent.statusCode);
                }}
            />
        </View>
    );
};

export default KeywordCloud;
