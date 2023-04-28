import { Box, List, ListItem, Text } from "@chakra-ui/react";
import nullthrows from "nullthrows";
import { GAPlace, GARoute, GAState, gaMapSize } from "./types";

const mapScale = 100;
const realMapSize = {
  width: gaMapSize.width * mapScale,
  height: gaMapSize.height * mapScale,
};

function Map({ places, route }: { places: GAPlace[]; route?: GARoute }) {
  return (
    <Box border="1px" borderRadius="lg">
      <svg
        viewBox={[
          -10,
          -10,
          realMapSize.width + 20,
          realMapSize.height + 20,
        ].join(" ")}
      >
        {route && route.placeLabels.length > 0 && (
          <polyline
            fill="none"
            stroke="#9df"
            points={route.placeLabels
              .map((label) => {
                const a = nullthrows(
                  places.find((place) => place.label === label),
                  `地点 ${label} は存在しません`
                );
                return `${a.x * mapScale},${a.y * mapScale}`;
              })
              .join(" ")}
          />
        )}
        {places.map((place) => (
          <g
            key={place.label}
            transform={`translate(${place.x * mapScale}, ${
              place.y * mapScale
            })`}
          >
            <circle
              x={0}
              y={0}
              r={5}
              fill="white"
              stroke="black"
              strokeWidth={1}
            />
            <text
              x={0}
              y={0}
              fontSize={6}
              textAnchor="middle"
              dominantBaseline="central"
            >
              {place.label}
            </text>
          </g>
        ))}
        {route?.placeLabels.map((placeLabel) => (
          <g key={placeLabel} />
        ))}
      </svg>
    </Box>
  );
}

export default function GARenderer({ state }: { state: GAState }) {
  return (
    <div>
      <Text fontSize="xl">地図</Text>
      <Box mt={1}>
        <Map places={state.places} />
      </Box>
      <Text fontSize="xl" mt={2}>
        遺伝子
      </Text>
      <List mt={1} spacing={4}>
        {state.routes.map((route, i) => (
          <ListItem
            key={route.label}
            display="grid"
            gridTemplateColumns="30px 1fr"
            gap={4}
          >
            <Text align="end">#{i + 1}</Text>
            <Map places={state.places} route={route} />
          </ListItem>
        ))}
      </List>
    </div>
  );
}
