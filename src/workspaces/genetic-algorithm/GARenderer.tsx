import { Box, Grid, List, ListItem, Text } from "@chakra-ui/react";
import nullthrows from "nullthrows";
import invariant from "tiny-invariant";
import { RiAlertLine, RiRoadMapFill } from "react-icons/ri";
import {
  GAPlace,
  GARoute,
  GAState,
  gaMapSize,
  gaPlaceCountInRoute,
} from "./types";

function Map({ places, route }: { places: GAPlace[]; route: GARoute }) {
  return (
    <Box
      backgroundImage={new URL("./map.jpg", import.meta.url).toString()}
      backgroundSize="cover"
      borderRadius="md"
    >
      <svg
        viewBox={[
          -500,
          -500,
          gaMapSize.width + 1000,
          gaMapSize.height + 1000,
        ].join(" ")}
      >
        {route.placeLabels.length > 0 && (
          <polyline
            fill="none"
            stroke="#666 "
            strokeWidth={30}
            points={route.placeLabels
              .map((label) => {
                const place = nullthrows(
                  places.find((p) => p.label === label),
                  `地点 ${label} は存在しません`
                );
                return `${place.x},${place.y}`;
              })
              .join(" ")}
          />
        )}
        {Array.from({ length: route.placeLabels.length - 1 }, (_, i) => {
          const from = places.find((p) => p.label === route.placeLabels[i]);
          const to = places.find((p) => p.label === route.placeLabels[i + 1]);
          invariant(from && to, `地点が見つかりません: ${route.placeLabels}`);
          const translate = {
            x: (from.x + to.x) / 2,
            y: (from.y + to.y) / 2,
          };
          const rotate = Math.atan2(to.y - from.y, to.x - from.x);
          return (
            <path
              key={`${from.label}-${to.label}`}
              d="M-80,120 L120,0 L-80,-120"
              fill="#666 "
              style={{
                transform: [
                  `translate(${translate.x}px, ${translate.y}px)`,
                  `rotate(${rotate}rad)`,
                ].join(" "),
              }}
            />
          );
        })}
        {places.map((place) => (
          <g key={place.label} transform={`translate(${place.x}, ${place.y})`}>
            <circle
              x={0}
              y={0}
              r={300}
              fill="white"
              stroke="black"
              strokeWidth={30}
            />
            <text
              x={0}
              y={0}
              fontSize={350}
              textAnchor="middle"
              dominantBaseline="central"
            >
              {place.label}
            </text>
          </g>
        ))}
        {route.placeLabels.map((placeLabel) => (
          <g key={placeLabel} />
        ))}
      </svg>
    </Box>
  );
}

export default function GARenderer({ state }: { state: GAState }) {
  return (
    <div>
      <Text fontSize="xl">ルート</Text>
      <List mt={1} spacing={4}>
        {state.routes.map((route, i) => {
          const totalDistance = Array.from(
            { length: route.placeLabels.length - 1 },
            (_, j) => {
              const from = state.places.find(
                (p) => p.label === route.placeLabels[j]
              );
              const to = state.places.find(
                (p) => p.label === route.placeLabels[j + 1]
              );
              invariant(
                from && to,
                `地点が見つかりません: ${route.placeLabels}`
              );
              return Math.sqrt((to.x - from.x) ** 2 + (to.y - from.y) ** 2);
            }
          ).reduce((a, b) => a + b, 0);
          return (
            <ListItem
              key={route.label}
              display="grid"
              gridTemplateColumns="100px 1fr"
              gap={2}
            >
              <Box>
                <Text fontSize="xl" display="flex" gap={1} alignItems="center">
                  <RiRoadMapFill />
                  {i + 1}
                </Text>
                <Text mt={2} fontSize="xs" color="gray.600">
                  総移動距離
                </Text>
                <Text fontSize="sm">{Math.round(totalDistance)} m</Text>
                {route.placeLabels.length < gaPlaceCountInRoute && (
                  <Grid
                    templateColumns="max-content 1fr"
                    alignItems="center"
                    gap={1}
                    mt={2}
                    fontSize="xs"
                    color="yellow.800"
                  >
                    <RiAlertLine fontSize="1.2em" />
                    <Text>
                      未到達地点
                      <br />
                      あり
                    </Text>
                  </Grid>
                )}
              </Box>
              <Map places={state.places} route={route} />
            </ListItem>
          );
        })}
      </List>
    </div>
  );
}
