const Notification = ({ message, tyyppi }) => {
    const styles = {
        kuittaus: {
            color: 'black',
            background: 'lightgreen',
            font: '14px',
            borderStyle: 'solid',
            borderRadius: '5px',
            padding: '10px',
            marginBottom: '10px',
            width: 'fit-content'
        },
        virhe: {
            color: 'red',
            background: 'lightgrey',
            font: '14px',
            borderStyle: 'solid',
            borderRadius: '5px',
            padding: '10px',
            marginBottom: '10px',
            width: 'fit-content'
        }
    }

    if (message === null) {
        return null
    }

    return (
        <div style={styles[tyyppi]}>
            {message}
        </div>
    )
}

export default Notification