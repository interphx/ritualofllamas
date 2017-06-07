import * as React from 'react';
import { observer } from 'mobx-react';

import { ResourceBag } from 'model/resource-bag';

@observer
export class ResourcesView extends React.Component<{resources: ResourceBag<string>}, {}> {
    render() {
        var props = this.props;
        return (
            <div className="resources">
                <table className="resources__table">
                    <tbody>
                    {
                        props.resources.getEntries().map(entry => 
                            <tr className="resources__row" key={entry[0]}>
                                <td className="resources__resource-name">{entry[0]}</td>
                                <td className="resources__resource-amount">{entry[1]}</td>
                            </tr>
                        )
                    }
                    </tbody>
                </table>
            </div>
        );
    }
}