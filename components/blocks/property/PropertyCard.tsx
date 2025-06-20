import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Card, Text, Icon } from "react-native-paper";
import { PropertyCardProps } from "@/shared/interfaces/property";
import { MaterialIcons } from "@expo/vector-icons";
import { useThemeStore } from "@/stores/useTheme";
import { useFavoriteStore } from "@/stores/favorites";
import { useSnackbar } from "@/stores/snackbar";

const home5 = require("@/assets/images/home5.jpg");

export default function PropertyCard({ property, onPress }: PropertyCardProps) {
  const { colors } = useThemeStore();
  const { isFavorite, toggleFavorite } = useFavoriteStore();
  const { showSnackbar } = useSnackbar();

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: property.currency || "USD",
    maximumFractionDigits: 0,
  }).format(property.price);

  const primaryImage =
    property.media?.images.find((img) => img.is_primary)?.url ||
    property.media?.images?.[0]?.url ||
    home5;

  const favorite = Boolean(isFavorite(Number(property.property_id)));
  const onFavoritePress = () => {
    toggleFavorite(Number(property.property_id));
    showSnackbar(
      favorite ? "Removed from favorites" : "Added to favorites",
      colors.black
    );
  };

  return (
    <Card
      style={[styles.card, { backgroundColor: colors.cardBackground }]}
      onPress={onPress}
    >
      <Card.Cover source={primaryImage} style={styles.coverImage} />

      <TouchableOpacity style={styles.favoriteButton} onPress={onFavoritePress}>
        <Icon
          source={favorite ? "heart" : "heart-outline"}
          size={24}
          color={colors.error}
        />
      </TouchableOpacity>

      <View style={[styles.priceBadge, { backgroundColor: colors.primary }]}>
        <Text variant="titleMedium" style={styles.priceText}>
          {formattedPrice}
        </Text>
      </View>

      <Card.Content style={styles.content}>
        <Text
          variant="titleLarge"
          numberOfLines={1}
          style={[styles.title, { color: colors.text }]}
        >
          {property.title}
        </Text>

        <View style={styles.locationRow}>
          <MaterialIcons name="location-on" size={16} color={colors.primary} />
          <Text
            variant="bodyMedium"
            style={[styles.locationText, { color: colors.textSecondary }]}
          >
            {property.address?.city}, {property.address?.state}
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          {property.features?.bedrooms && (
            <View style={styles.featureItem}>
              <MaterialIcons name="bed" size={16} color={colors.warning} />
              <Text
                variant="bodySmall"
                style={[{ fontWeight: "bold", color: colors.text }]}
              >
                {property.features.bedrooms}
              </Text>
            </View>
          )}

          {property.features?.bathrooms && (
            <View style={styles.featureItem}>
              <MaterialIcons name="bathtub" size={16} color={colors.warning} />
              <Text
                variant="bodySmall"
                style={[{ fontWeight: "bold", color: colors.text }]}
              >
                {property.features.bathrooms}
              </Text>
            </View>
          )}

          {property.features?.floor_area && (
            <View style={styles.featureItem}>
              <MaterialIcons
                name="straighten"
                size={16}
                color={colors.primary}
              />
              <Text variant="bodySmall" style={{ color: colors.text }}>
                {property.features.floor_area} sqm
              </Text>
            </View>
          )}
        </View>

        <View style={styles.metaContainer}>
          <View style={styles.typeBadge}>
            <Text variant="labelSmall" style={styles.typeText}>
              {property.type?.toUpperCase()}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  {
                    available: "#4CAF50",
                    sold: "#F44336",
                    rented: "#FFC107",
                  }[property.status] || "#FFC107",
              },
            ]}
          >
            <Text variant="labelSmall" style={styles.statusText}>
              {property.status?.toUpperCase()}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 8,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
  },
  coverImage: {
    height: 180,
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 1,
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 24,
  },
  priceBadge: {
    position: "absolute",
    top: 140,
    left: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 1,
  },
  priceText: {
    color: "#fff",
    fontWeight: "bold",
  },
  content: {
    padding: 16,
  },
  title: {
    marginBottom: 4,
    fontWeight: "bold",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  locationText: {
    marginLeft: 4,
  },
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  typeBadge: {
    backgroundColor: "#E0E0E0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  typeText: {
    color: "#424242",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: "#fff",
  },
});
