const ViewAllLink = (props) => {
    return (
        <div>
            <button class='btn' style={{color: 'white', backgroundColor: '#0061c9'}}>{`${props.text} >`}</button>
        </div>
    );
}

export default ViewAllLink;