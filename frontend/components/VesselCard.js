export function VesselCard({ vessel }) {
  return `<div class="vessel-card">
    <h3>${vessel.name}</h3>
    <p>Capacity: ${vessel.capacity} tons</p>
    <span class="status ${vessel.status}">${vessel.status}</span>
