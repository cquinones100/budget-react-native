import React, { Dispatch, SetStateAction, SyntheticEvent, useCallback, useEffect, useState } from 'react';
import Medium from '../../styles/Medium';
import { ScrollView, View, SafeAreaView, useColorScheme, StyleSheet, Dimensions } from "react-native";
import moment from 'moment';
import Dark from '../../styles/Dark';
import Base from '../../styles/Base';
import DateComponent from '../DateComponent';
import LineChart from 'react-native-chart-kit/dist/line-chart/LineChart';
import { StyledText } from '../StyledText';

const CHART_COLORS = ['#3367CC', '#03ADA8', '#DC3913', '#FF9901'];
const DEFAULT_SCENARIOS = [
  'Default Scenario',
  'Buy a 450K house in Feb 2022 with 15.75K down payment',
  'Rachel Gets a Job in September 2021'
]

const dateString = (date: Date) => (
  moment(date).format('YYYY-MM-DD')
);

type DataState = Array<Data>;

type Data = {
  data: {
    [key: string]: number
  },
  name: string
};

const Show = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(moment(new Date()).add(1, 'year').toDate());
  const [data, setData] = useState([{ data: {} }] as DataState);

  const startDateUrl = (prevUrl: string, omitQuestionMark = false) => {
    if (!startDate) return prevUrl;

    return prevUrl + (omitQuestionMark ? '' : '?') + `start_date=${dateString(startDate)}`;
  };

  const dateUrl = (date: string, root = '/projections'): string => `${root}/${date}`;
  const newUrl = (): string => {
    const SCENARIO_NAMES = '&scenario_names[]=';
    return startDateUrl(dateUrl(dateString(endDate))) +
    SCENARIO_NAMES + DEFAULT_SCENARIOS.join(SCENARIO_NAMES);
  };

  const [url, setUrl] = useState(newUrl());

  const handleDateChange = (
    event: SyntheticEvent<Readonly<{ timestamp: number; }>>,
    selectedDate: Date | undefined,
    callback: Dispatch<SetStateAction<Date>>) => {
    if (selectedDate) callback(selectedDate);
  };

  useEffect(() => {
    setUrl(newUrl());
  }, [startDate, endDate])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await fetch('http://192.168.1.180:3000' + url, {
          headers: new Headers({ 'content-type': 'application/json' })
        });
        const data = await resp.json();

        setData(data);
      } catch (e) {
        console.log(e)
      }
    };

    fetchData();
  }, [url]);

  const splitIntoChunks = (arr: any[], numChunks: number) => {
    const chunkSize = Math.floor(arr.length / (numChunks - 1));
    let indexes = [];
    let counter = 0;

    while (counter < (arr.length - 1)) {
      indexes.push(counter);

      counter += chunkSize;
    }

    return indexes.map(index => arr[index]).concat([arr[arr.length - 1]]);
  };

  const labels = splitIntoChunks(Object.keys(data[0].data).map((date) => date.slice(0, 7)), 4);
  const datasets = data.map((datum, index) => ({
    data: splitIntoChunks(Object.values(datum.data), 4),
    color: () => CHART_COLORS[index]
  }));

  console.log('labels', labels)
  console.log('datasets', datasets)
  return (
    <ScrollView
      alwaysBounceVertical={false}
      style={{ backgroundColor: Dark.backgroundColor, padding: Base.padding }}
    >
      <SafeAreaView>
        <View>
          <StyledText style={{ fontSize: Medium.fontSize}}>
            {DEFAULT_SCENARIOS.join(', ')}
          </StyledText>
        </View>
        <View style={{
          flex: 1,
          flexDirection: "row",
          padding: Base.padding,
          borderBottomColor: Dark.borderColor,
          borderBottomWidth: StyleSheet.hairlineWidth,
        }}>
          <DateComponent
            value={startDate}
            onChange={(event, selectedDate) => {
              handleDateChange(event, selectedDate, setStartDate)
            }}>
            Start Date
          </DateComponent>
          <DateComponent
            value={endDate}
            onChange={(event, selectedDate) => {
              handleDateChange(event, selectedDate, setEndDate)
            }}>
            End Date
          </DateComponent>
        </View>
        {/* <LineChart
          data={{
            labels,
            datasets,
            legend: data.map(data => data.name || '')
          }}
          fromZero
          verticalLabelRotation={0}
          xLabelsOffset={-10}
          width={Dimensions.get("window").width - (Medium.margin * 2)} // from react-native
          height={400}
          chartConfig={{
            decimalPlaces: 0, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          bezier
          style={{
            marginVertical: Base.margin,
            padding: Base.padding,
            borderRadius: Base.margin
          }}
        /> */}
      </SafeAreaView>
    </ScrollView>
  )
};

export default Show;