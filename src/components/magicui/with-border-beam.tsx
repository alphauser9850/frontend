import React from 'react';
import { BorderBeam, BorderBeamProps } from './border-beam';

interface WithBorderBeamProps extends Omit<BorderBeamProps, 'className'> {
  wrapperClassName?: string;
  children: React.ReactNode;
}

/**
 * A higher-order component that wraps any component with a Border Beam effect.
 * 
 * @example
 * ```tsx
 * <WithBorderBeam
 *   colorFrom="#6366f1"
 *   colorTo="#8b5cf6"
 *   duration={8}
 *   size={100}
 * >
 *   <YourComponent />
 * </WithBorderBeam>
 * ```
 */
export const WithBorderBeam: React.FC<WithBorderBeamProps> = ({
  children,
  wrapperClassName = '',
  ...borderBeamProps
}) => {
  return (
    <div className={`relative overflow-hidden rounded-xl ${wrapperClassName}`}>
      {children}
      <BorderBeam {...borderBeamProps} />
    </div>
  );
};

/**
 * A higher-order component factory that creates a component with Border Beam effect.
 * 
 * @example
 * ```tsx
 * const CardWithPurpleBeam = withBorderBeam(Card, {
 *   colorFrom: "#6366f1",
 *   colorTo: "#8b5cf6",
 *   duration: 8,
 *   size: 100
 * });
 * 
 * // Then use it like:
 * <CardWithPurpleBeam>Your content</CardWithPurpleBeam>
 * ```
 */
export function withBorderBeam<P extends object>(
  Component: React.ComponentType<P>,
  borderBeamProps: Omit<BorderBeamProps, 'className'>
) {
  return (props: P & { wrapperClassName?: string }) => {
    const { wrapperClassName = '', ...componentProps } = props;
    
    return (
      <WithBorderBeam
        wrapperClassName={wrapperClassName}
        {...borderBeamProps}
      >
        <Component {...componentProps as P} />
      </WithBorderBeam>
    );
  };
}

export default withBorderBeam; 