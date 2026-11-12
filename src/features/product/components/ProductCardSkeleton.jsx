import { Card, Placeholder, Row, Col } from 'react-bootstrap';

export default function ProductCardSkeleton({ size = 3 }) {
  return (
    <div className={`col-lg-${size} col-md-6 col-12`}>
    <Card className="h-100 shadow-sm border-0 rounded-3">
      <Placeholder as="div" animation="wave">
        <Placeholder className="w-100 bg-secondary-subtle rounded-top-3" style={{ height: '220px' }} />
      </Placeholder>
      <Card.Body className="d-flex flex-column justify-content-between">
        <div>
          <Placeholder as={Card.Subtitle} animation="wave" className="mb-2">
            <Placeholder xs={4} size="xs" className="bg-secondary-subtle" />
          </Placeholder>
          <Placeholder as={Card.Title} animation="wave" className="mb-3">
            <Placeholder xs={9} className="bg-secondary-subtle" />{' '}
            <Placeholder xs={6} className="bg-secondary-subtle" />
          </Placeholder>
        </div>
        <div>
          <Row className="align-items-center mb-3">
            <Col xs={6}>
              <Placeholder as="div" animation="wave">
                <Placeholder xs={8} size="lg" className="bg-secondary-subtle" />
              </Placeholder>
            </Col>
            <Col xs={6} className="text-end">
              <Placeholder as="div" animation="wave">
                <Placeholder xs={6} size="sm" className="bg-secondary-subtle" />
              </Placeholder>
            </Col>
          </Row>
          <Placeholder.Button variant="primary" animation="wave" className="w-100 disabled" />
        </div>
      </Card.Body>
    </Card>
     </div>
  );
}