import React from 'react';

const UserContext = React.createContext();

export const UserProvider = UserContext.Provider;
export const UserConsumer = UserContext.Consumer;

export function withContext(Component) {
	const hocComponent = ({...props}) => (
		<UserConsumer>
			{propsContext => <Component {...props} user={propsContext.user} loadUserData={propsContext.loadUserData} />}
		</UserConsumer>
	);

	return hocComponent;
}

export default UserContext;