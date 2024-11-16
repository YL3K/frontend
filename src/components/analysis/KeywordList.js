import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

function KeywordList({data}) {
    const topKeywords = data
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    const renderItem = ({ item, index }) => (
        <View style={styles.item}>
            <Text style={styles.rank}>{index + 1}.</Text>
            <Text style={styles.keyword}>{item.keyword}</Text>
            <Text style={styles.count}>{item.count.toLocaleString()}건</Text>
        </View>
    ); 

    return (
        <FlatList
            data={topKeywords}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
        />
    );
}

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#DCD9D9',
        paddingVertical: 5,
        marginHorizontal: 10,
    },
    rank: {
        fontSize: 15,
        fontWeight: 'bold',
        marginRight: 8,
    },
    keyword: {
        fontSize: 15,
        flex: 1,
    },
    count: {
        fontSize: 15,
        fontWeight: '700',
    },
});

export default KeywordList;