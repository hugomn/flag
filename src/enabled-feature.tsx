import * as React from 'react';
import { key } from './key';
import { Flags, FlagChildProps, Value, Renderer } from './types';

export interface FlagProps {
  name: string;
  component?: React.ComponentType<FlagChildProps<any>>;
  fallbackComponent?: React.ComponentType<FlagChildProps<any>>;
  render?: Renderer;
  fallbackRender?: Renderer;
  [key: string]: any;
}

function getFlag(flags: Flags, keyPath: string): Value | void {
  const [head, ...tail] = keyPath.split('.');
  let result: Value = (flags as Flags)[head];

  for (const key of tail) {
    result = (result as Flags)[key];

    if (result === undefined || result === null) {
      return false;
    }
  }

  return result;
}

function resolve(
  props: FlagChildProps<any>,
  component?: React.ComponentType<FlagChildProps<any>>,
  render?: Renderer,
): React.ReactElement<any> | null {
  if (component) {
    return React.createElement(component as React.ComponentClass<FlagChildProps<any>>, props);
  }

  if (render) {
    return render(props) as React.ReactElement<any> | null;
  }

  return null;
}

export class EnabledFeature extends React.Component<FlagProps, {}> {
  public static contextTypes = { [key]: () => null };

  public render(): any {
    const { name, children} = this.props;
    if (Boolean(getFlag(this.context[key], name))) {
      return children;
    } else {
      return null;
    }
  }
}
