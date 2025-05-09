# Magic UI Components

A collection of beautiful UI components inspired by the Magic UI design system. These components add subtle, elegant animations and effects to your React application.

## Components

### MagicCard

A card component with a spotlight effect that follows the cursor and a gradient border that appears on hover.

```tsx
import { MagicCard } from './magicui/magic-card';

<MagicCard 
  className="p-6 rounded-xl"
  gradientFrom="#3B82F6" 
  gradientTo="#10B981"
  gradientSize={250}
>
  <h3>Your Content Here</h3>
  <p>This card has a beautiful spotlight effect and gradient border.</p>
</MagicCard>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `''` | Additional CSS classes to apply to the card |
| `gradientFrom` | `string` | `'#6366f1'` | Starting color of the gradient border |
| `gradientTo` | `string` | `'#8b5cf6'` | Ending color of the gradient border |
| `gradientSize` | `number` | `250` | Size of the gradient in pixels |
| `children` | `ReactNode` | - | Content to render inside the card |

### BorderBeam

An animated border beam effect that can be applied to any container.

```tsx
import { BorderBeam } from './magicui/border-beam';

<div className="relative overflow-hidden rounded-xl">
  <YourComponent />
  <BorderBeam 
    duration={8} 
    size={100}
    colorFrom="#6366f1"
    colorTo="#8b5cf6"
  />
</div>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `duration` | `number` | `10` | Duration of the animation in seconds |
| `size` | `number` | `150` | Size of the beam in pixels |
| `colorFrom` | `string` | `'#6366f1'` | Starting color of the gradient |
| `colorTo` | `string` | `'#8b5cf6'` | Ending color of the gradient |

### WithBorderBeam

A higher-order component that wraps any component with a Border Beam effect.

```tsx
import { WithBorderBeam } from './magicui/with-border-beam';

<WithBorderBeam
  colorFrom="#6366f1"
  colorTo="#8b5cf6"
  duration={8}
  size={100}
>
  <YourComponent />
</WithBorderBeam>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `wrapperClassName` | `string` | `''` | Additional CSS classes to apply to the wrapper div |
| `duration` | `number` | `10` | Duration of the animation in seconds |
| `size` | `number` | `150` | Size of the beam in pixels |
| `colorFrom` | `string` | `'#6366f1'` | Starting color of the gradient |
| `colorTo` | `string` | `'#8b5cf6'` | Ending color of the gradient |
| `children` | `ReactNode` | - | Content to wrap with the border beam effect |

### withBorderBeam

A higher-order component factory that creates a component with Border Beam effect.

```tsx
import { withBorderBeam } from './magicui/with-border-beam';
import { Card } from '../ui/card';

const CardWithPurpleBeam = withBorderBeam(Card, {
  colorFrom: "#6366f1",
  colorTo: "#8b5cf6",
  duration: 8,
  size: 100
});

// Then use it like:
<CardWithPurpleBeam>Your content</CardWithPurpleBeam>
```

## Usage Examples

Check out the `MagicUIDemo.tsx` component for examples of how to use these components in your application.

```tsx
import MagicUIDemo from './components/MagicUIDemo';

// In your routes:
<Route path="/magic-ui-demo" element={<MagicUIDemo />} />
```

## Dependencies

These components require:

- React
- Framer Motion
- Tailwind CSS

## License

MIT 